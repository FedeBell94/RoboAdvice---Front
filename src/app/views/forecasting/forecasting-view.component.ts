import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";
import { Observable } from "rxjs/Observable";
import { BackTestingService } from "../../services/back-testing/back-testing.service";
import { StrategyService } from "../../services/strategy/strategy.service";
import { AuthService } from "../../services/remote/authentication.service";
import { ForecastingService, LoadingBar } from "../../services/forecasting/forecasting.service";

@Component({
    selector: 'forecastingView',
    templateUrl: 'forecasting-view.template.html',
    styleUrls: ['forecasting-view.style.css']
})
export class forecastingViewComponent {
    constructor(
        private data: BackTestingService,
        private auth: AuthService,
        private strategy: StrategyService,
        private forecast: ForecastingService,
        private _nz: NgZone,
    ) { }
    private roboAdviceConfig = RoboAdviceConfig;
    private chartOptions;

    /* Second type of forecasting */
    private forecastingData: any;

    getForecasting(){
        if (this.forecastingData) return;
        this.forecast.getForecastingSimulation().subscribe((res)=>{
            if (res.response > 0) {
                this.forecastingData = res.data;
            }
        });
    }

    getChartOptionsSecondType(){
        return this.forecastingData;
    }
    /* end */

    get loading() {
        return this.forecast.loading;
    }
    get state() {
        return this.forecast.state;
    }

    isLogged() {
        return this.auth.isLogged();
    }

    hasNNCached() {
        return this.forecast.hasCached();
    }

    getChartOptions() {
        return this.chartOptions;
    }

    prepareNeuralNetwork() {
        this.forecast.prepareNN().subscribe(res=> {
            if (res.response <= 0) {
                // TODO: print an error
                return;
            }
            
            // progress update has been sent
            if (this.loading.current == this.loading.total) {
                //TODO: loading has finished
            }

            // training is made into a web worker, so we need to call NgZone to update the view
            this._nz.run(()=> {});
        });
    }

    getForecastingData(days: number) {
        this.chartOptions = null;
        this.forecast.getForecastChartOptions(days).subscribe(res=> {
            if (res.response > 0) {
                this.chartOptions = res.data;
            }
        });
    }

    ngOnInit() {
        if (!this.auth.isLogged()) return;
        if (this.state == 'done') {
            this.forecast.getForecastChartOptions().subscribe(res=> {
                if (res.response > 0) {
                    this.chartOptions = res.data;
                }
            });
        }

        this.getForecasting();

    }

}