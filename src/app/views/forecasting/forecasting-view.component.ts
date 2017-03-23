import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";
import { Observable } from "rxjs/Observable";
import { BackTestingService } from "../../services/back-testing/back-testing.service";
import { StrategyService } from "../../services/strategy/strategy.service";

@Component({
    selector: 'forecastingView',
    templateUrl: 'forecasting-view.template.html',
    styleUrls: ['forecasting-view.style.css']
})
export class forecastingViewComponent {
    constructor(
        private data: BackTestingService,
        private strategy: StrategyService,
    ) { }

    private roboAdviceConfig = RoboAdviceConfig;
    private synaptic = (window as any).synaptic.Architect;

    ngOnInit() {
        const synaptic = (window as any).synaptic;
        Observable.create(observer=> {
            this.strategy.getStrategy().subscribe((resStrategy)=> {
                if (resStrategy.response <= 0) return;
                //now i got the strategy
                let strat = new Strategy();
                strat.asset_class = resStrategy.data;
                this.data.getRawBackTestingSimulation(strat, "2014-04-30").subscribe((resData)=> {
                    if (resData.response <= 0) return;
                    //now i got the raw data
                    let grouped = this.groupByDate(resData.data);
                    let trainingData = this.getTrainingData(grouped);
                });

            });




            setTimeout(()=> {
                let net = new synaptic.Architect.Perceptron(180*4, 100, 20, 4);
                let trainingData = [];
                for (let i = 0; i < 180; i++) {

                }
            }, 1);

        });

        
    }

    private getTrainingData(data) {
        let r;
        for (let i = 0; i < data.length - 180; i++) {
            //foreach set of 180 days starting from initial date
            for (let j = 0; j < 180; j++) {
                
            }
        }
    }

    private groupByDate(data) {
        let r;
        for (let i = 0; i < data.length; i++) {
            r[data[i].date].push(data[i]);
        }
        return r;
    }
}