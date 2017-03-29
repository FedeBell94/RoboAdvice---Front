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
import { NeuralNetworkService } from "./neural-network.service";
import { BackTestingService } from "../back-testing/back-testing.service";
import { PortfolioService } from "../portfolio/portfolio.service";

@Injectable()
export class ForecastingService {
    constructor(
        private apis: ApiService,
        private strategy: StrategyService,
        private assetService: AssetService,
        private nn: NeuralNetworkService,
        private backtesting: BackTestingService,
        private portfolio: PortfolioService,
    ) { }

    public state = "none";
    public loading = new LoadingBar(100, 0);

    private nnChartOptions: any;

    private rawForecastingDataForNeuralNetwork: any;

    getRawForecastDataForNeuralNetwork(){
        return this.rawForecastingDataForNeuralNetwork;
    }

    getRawForecastingData(): Observable<GenericResponse> {
      return this.apis.get('forecast').map((res: GenericResponse) => {
        return new GenericResponse(1, 0, "", res.data);
      });
    }

    /* Second type of Forecasting */
    getForecastingSimulation(): Observable<GenericResponse> {
        return this.apis.get('forecast').map((res: GenericResponse) => {
            let graph = this.computeData(res.data);
            return new GenericResponse(1, 0, "", graph);
        });
    }

    private computeData(data: any) {

        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions('ForecastingSimulation', 'value'));

        let dataProvider = [];
        let tmp = [];
        for (let i = 0; i < data.length; i++) {
            if (!tmp[data[i].date])
                tmp[data[i].date] = 0;

            tmp[data[i].date] += data[i].value;
        }

        for (let y in tmp) {
            dataProvider.push({
                date: y,
                value: Math.round(tmp[y] * 100) / 100,
            });
        }

        return ChartUtils.getOptions(dataProvider, graphOptions);
    }
    /* end */

    getForecastData(days: number): Observable<GenericResponse> {
        let obs: Observable<GenericResponse>;
        obs = Observable.create(observer=> {
            setTimeout(()=> {
                observer.next(new GenericResponse(1, 0, "", this.nn.activate(days)));
                observer.complete();
            }, 1);
        });
        return obs;

    }

    public hasCached() {
        return this.nn.hasCached();
    }

    public prepareNN(): Observable<GenericResponse> {
        // TODO: return an observable for the progress of the loading
        // STEPS:
        // 1)   there's something cached
        // 2)   if not, do requests to get data
        // 2.5)     preparing the network
        // 3)       start training the network
        // 4)       receiving informations each iteration to up the progress bar
        // 5)   if yes, get the neural network from the cache
        // 6)   preparation done!
        //
        // in the meanwhile, GenericResponses are sent to the observer to notify the state of the loading

        let obs: Observable<GenericResponse>;
        this.loading = new LoadingBar(0, 0);


        this.state = "trainingNN";
        // STEP 1)
        if (this.nn.hasCached()) {
            // STEP 5)
        } else {
            //preparing loading informations
            this.loading['_total'] += 3;                                          //calls to the server
            this.loading['_total'] += 2;                                          //preparing training data
            this.loading['_total'] += 1;                                          //configuring the network
            this.loading['_total'] += 5;                                          //creating the network
            this.loading['_total'] += NeuralNetworkService.TrainingIterations;    //iterations of training for the neural network
            //console.log("total: ", + this.loading['_total']);
            // STEP 2)
            obs = Observable.create(observer=> {
                //STEP 2.a)
                this.strategy.getStrategy().subscribe((resStrategy)=> {
                    if (resStrategy.response <= 0) {
                        //can't get the strategy
                        observer.next(new GenericResponse(0, 400, "Cannot reach the server, try again later!", null));
                        observer.complete();
                        return;
                    }
                    this.loading = new LoadingBar(this.loading['_total'], this.loading['_current'] + 1);
                    observer.next(new GenericResponse(1, 0, "", this.loading.current)); //loading iteration complete
                    // STEP 2.b)
                    let strat = new Strategy();
                    strat.asset_class = resStrategy.data;
                    // TODO: caching data ?
                    this.backtesting.getRawBackTestingSimulation(strat, this.nn.startingTrainingDate).subscribe((resData)=> {
                        if (resStrategy.response <= 0) {
                            //can't get the historical data
                            observer.next(new GenericResponse(0, 400, "Cannot reach the server, try again later!", null));
                            observer.complete();
                            return;
                        }
                        this.loading = new LoadingBar(this.loading['_total'], this.loading['_current'] + 2);
                        observer.next(new GenericResponse(1, 0, "", this.loading)); //loading iteration complete
                        // STEP 2.5)
                        this.nn.initNetwork(resData.data);
                        this.loading = new LoadingBar(this.loading['_total'], this.loading['_current'] + 2);
                        observer.next(new GenericResponse(1, 0, "", this.loading)); //loading iteration complete
                        this.nn.configureNetwork();
                        this.loading = new LoadingBar(this.loading['_total'], this.loading['_current'] + 6);
                        observer.next(new GenericResponse(1, 0, "", this.loading)); //loading iteration complete

                        // STEP 3)
                        this.nn.trainNetwork().subscribe(resTraining=> {
                            if (resTraining.response <= 0) {
                                //problem during training
                                // TODO: do something?
                                return;
                            } else {
                                this.loading = new LoadingBar(this.loading['_total'], this.loading['_current'] + resTraining.data);
                                observer.next(new GenericResponse(1, 0, "", this.loading)); //loading iteration complete
                                if (this.loading.current == this.loading.total) {
                                    observer.complete();
                                    this.state = "ready";
                                }
                            }
                        });
                    });
                });
            });
            return obs;
        }
    }

    public getForecastChartOptions(days?: number): Observable<GenericResponse> {
        let obs: Observable<GenericResponse>;
        obs = Observable.create(observer=> {
            if (this.nnChartOptions && !days) {
                //if i have cached
                observer.next(new GenericResponse(1, 0, "", this.nnChartOptions));
                observer.complete();
                return;
            }
            if(!days) {
                //ERROR, missing paramter
                console.error("missing parameter 'days'", new Error().stack);
            }
            this.getForecastData(days).subscribe((res)=> {
                this.portfolio.getWorth().subscribe(resProtfolio=> {
                    if (resProtfolio.response > 0) {
                        if (!resProtfolio.data) resProtfolio.data = RoboAdviceConfig.DefaultInitialWorth;
                        // save data for 'Recommended Strategy'
                        this.rawForecastingDataForNeuralNetwork = res.data;
                        this.nnChartOptions = this.computeData(res.data);
                        let diff = resProtfolio.data - this.nnChartOptions.dataProvider[0].value;
                        for (let i = 0; i < this.nnChartOptions.dataProvider.length; i++) {
                            this.nnChartOptions.dataProvider[i].value += diff;
                        }
                        this.state = "done";
                        observer.next(new GenericResponse(1, 0, "", this.nnChartOptions));
                        observer.complete();
                    } else {
                        // TODO: handle this error
                    }
                });
            });
        });
        return obs;
    }
}

export class LoadingBar {
    constructor(total: number, current: number) {
        this.total = total;
        this.current = current;
    }
    private static _quotes = [
        "Praying the gods",
        "Hoping in the forces of the universe",
        "Asking numbers to grandma",
        "Seeking black cats",
        "Building 13th floor",
        "Thinking what to say",
        "Fearing the chiprel",
        "Studiyng economics",
        "Hiring a witch",
        "Converting matter to gold",
        "Interleaving reasonings",
        "Waiting for a God's sign",
        "Playing football",
        "Listening to some good music",
        "Checking the stock markets",
        "Stealing ideas",
        "Calling the technical support",
        "Randomizing things",
        "Hiring a mathematician",
        "Following my tail",
        "Looking behind me",
        "Innovating",
        "Discovering new technologies",
        "Getting a promotion",
        "Discussing with the boss"

    ];
    private static _qIndex = 0;
    private shuffle(arr: any[]) {
        let r = arr;
        for (let i = 0; i < arr.length; i++) {
            let rand = Math.round(Math.random() * (arr.length - i)) + i;
            let temp = r[i];
            r[i] = r[rand];
            r[rand] = temp;
        }
        return r;
    }
    private _total: number;
    private _current: number;
    get total() {
        return 1000;
    }
    set total(value: number) {
        this._total = (value < 0 ? 0 : value);
    }
    get current() {
        return Math.ceil(this._current * 1000 / this._total);
    }
    set current(value: number) {
        this._current = (value < 0 ? 0 : value);
    }
    get quote() {
        if (LoadingBar._qIndex == 0) {
            this.shuffle(LoadingBar._quotes);
            LoadingBar._qIndex++;
        }
        return LoadingBar._quotes[Math.ceil(this._current * 15 / this._total)] + "...";
    }
}
