import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";

import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";
import { AssetCache } from "../../model/asset/asset-cache";
import { AtomicAsync } from "../../annotations/atomic.annotation";
import { Portfolio } from "../../model/portfolio/portfolio";
import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";
import { AssetSnapshot } from "../../model/portfolio/asset-snapshot";
import { AssetService } from "../asset/asset.service";
import { StrategyService } from "../strategy/strategy.service";

@Injectable()
export class NeuralNetworkService {
    constructor(
        private apis: ApiService,
        private strategy: StrategyService,
        private assetService: AssetService,
    ) { }
    public static TrainingRate = .25;
    public static TrainingIterations = 10000;
    public static ErrorRatio = 0.000007;
    public static BackDays = 30;
    public startingTrainingDate: string = "2015-01-27";

    private maxValue = 10000;
    private trainingData: any;
    private trainer;
    private currentIteration = 0;
    private assetClassesNumber = 4;

    //@LocalStorage() this require 1.6GB Memory
    private neuralNetwork;

    public wipeCache() {
        this.trainingData = undefined;
        this.trainer = undefined;
        this.currentIteration = 0;
        this.neuralNetwork = undefined;
    }

    public hasCached(): boolean {
        // TODO: check if there is a nn cached
        return false;
    }

    public getNeuralNetwork(data: any): Observable<GenericResponse> {
        return Observable.create(obs=> {

        });
    }

    public configureNetwork() {
        let synaptic = (window as any).synaptic;

        const trainingSet = this.trainingData;

        //synaptic job
        const Layer = synaptic.Layer;
        const Network = synaptic.Network;
        const Trainer = synaptic.Trainer;

        const inputSize = NeuralNetworkService.BackDays * this.assetClassesNumber;

        const inputLayer = new Layer(inputSize);
        const hiddenLayer = new Layer(Math.round(inputSize / 10));
        const outputLayer = new Layer(this.assetClassesNumber);

        inputLayer.project(hiddenLayer);
        hiddenLayer.project(outputLayer);

        this.neuralNetwork = new Network({
            input: inputLayer,
            hidden: [hiddenLayer],
            output: outputLayer
        });

        //checking data consistency
        for(let i = 0; i < trainingSet.length; i++) {
            for (let j = 0; j < trainingSet[i].input.length; j++) {
                if (trainingSet[i].input[j] > 1 || trainingSet[i].input[j] < 0) console.log("problem");
            }
            for (let j = 0; j < trainingSet[i].output.length; j++) {
                if (trainingSet[i].output[j] > 1 || trainingSet[i].output[j] < 0) console.log("problem");
            }
        }
        this.trainer = new Trainer(this.neuralNetwork);
    }

    public initNetwork(data: any) {
        let grouped = this.groupByDate(data);
        
        let n = 0;
        const firstKey = Object.keys(grouped)[0];
        for (let i = 0; i < grouped[firstKey].length; i++) {
            n = grouped[firstKey][i].assetClassId > n ? grouped[firstKey][i].assetClassId : n;
        }
        this.assetClassesNumber = n;

        this.trainingData = this.getTrainingData(grouped);
    }

    public trainNetwork(): Observable<GenericResponse> {
        // start training the neural network asyncronously, sending messages about the state of the work by an Observable
        let obs = Observable.create(observer=> {
            this.currentIteration = 0;

            this.trainer.trainAsync(this.trainingData, {
                rate: NeuralNetworkService.TrainingRate,
                error: NeuralNetworkService.ErrorRatio,
                iterations: NeuralNetworkService.TrainingIterations,
                const: (window as any).synaptic.Trainer.cost.MSE,
                schedule: {
                    every: 1,
                    do: (data)=> {
                        console.log("error", (Math.round(data.error * this.maxValue * 100 * 100) / 100) + "%", "iterations", data.iterations, "rate", data.rate);
                        this.currentIteration++;
                        observer.next(new GenericResponse(1, 0, "", 1));    //sending info about completeness
                    }
                }
            }).then(res=> {
                observer.next(new GenericResponse(1, 0, "", NeuralNetworkService.TrainingIterations - this.currentIteration));
                observer.complete();
            });
        });
        return obs;
    }

    public activate(days: number) {
        let results = [];
        let todate = new Date();
        let classes: number;
        todate.setDate(todate.getDate());

        //getting last 6 months of data
        let input = this.trainingData[this.trainingData.length - 2].input;

        //for each requested day
        for (let i = 0; i < days; i++) {
            //activate network
            let out = this.neuralNetwork.activate(input);
            //get the results
            for (let j = 1; j <= out.length; j++) {
                classes = out.length;
                results.push({
                    date: todate.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-'),
                    assetClassId: j,
                    value: out[j - 1] * this.maxValue
                });
            }
            //removing first day and adding the new one
            let addr = input.length / classes;
            for (let j = 0; j < out.length; j++) {
                //insert last
                input.splice(addr * j + addr - 1, 0, out[j]);

                //removing first
                input.splice(addr * j, 1);
            }
            
            //adding one day
            todate.setDate(todate.getDate() + 1);
        }
        return results;
    }
    
    private getTrainingData(data) {
        // data is in format
        // { "2016-01-01": [{assetClassId: 1, date: "2016-01-01", "value": 1364.1233} ...]}
        // 
        let r = [];
        const firstKey = Object.keys(data)[0];
        for (let i = 0; i < data[firstKey].length; i++) {
            r[data[firstKey][i].assetClassId] = [];
        }

        let di = 0;
        for (let i in data) {
            for (let j = 0; j < r.length; j++) {
                if (r[j] != undefined) r[j].push(0);
            }
            for (let j = 0; j < data[i].length; j++) {
                let inst = data[i][j];
                r[inst.assetClassId][di] += inst.value;
            }
            di++;
        }
        let ts = [];
        for (let i = 0; i < r[1].length - NeuralNetworkService.BackDays - 1; i++) {
            //foreach set of NeuralNetworkService.BackDays days starting from initial date, plus the result
            let inp = [];
            let out = [];
            for (let j = 0; j < r.length; j++) {
                if (!r[j]) continue;
                inp = inp.concat(r[j].slice(i, i + NeuralNetworkService.BackDays));
                out.push(r[j][i + NeuralNetworkService.BackDays]);
            }
            let input = [], output = [];
            //normalizing data
            for (let j = 0; j < inp.length; j++) {
                input.push(inp[j] / this.maxValue);
            }
            for (let j = 0; j < out.length; j++) {
                output.push(out[j] / this.maxValue);
            }
            //adding to training data
            ts.push({
                input: input,
                output: output,
            });
        }
        return ts;
    }

    private groupByDate(data) {
        let r = {};
        for (let i = 0; i < data.length; i++) {
            if (r[data[i].date] === undefined) r[data[i].date] = [];
            r[data[i].date].push(data[i]);
        }
        return r;
    }
}