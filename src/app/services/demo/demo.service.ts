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

@Injectable()
export class DemoService {
    constructor(
        private apis: ApiService,
        private assetService: AssetService,
    ) { }
    private cache = new DemoCache();

    getCached(property: string) {
        return this.cache[property];
    }

    getCurrentDate() {
        return this.cache.lastComputedDate;
    }
    setCurrentDate(val: string) {
        this.cache.lastComputedDate = val;
    }
    
    demoDate(strategy: Strategy): Observable<GenericResponse> {
        return Observable.create(observer=> {
            this.apis.post("demo", {
                strategyInput: strategy.asset_class,
                from: this.cache.lastComputedDate,
                worth: this.cache.worth
            }).subscribe(res=> {
                if (res > 0) {
                    this.assetService.getAssets().subscribe(resAsset=> {
                        if (resAsset.response > 0) {
                            if (!this.cache.raw) this.cache.raw = [];
                            this.cache.raw = this.cache.raw.concat(res.data);
                            //let's elaborate data
                            this.computeCache(res.data, resAsset);
                            
                        }
                        //now let's return data!
                        observer.next(resAsset);
                        observer.complete();

                    })
                } else {
                    //error retrieving asset data
                    observer.next(res);
                    observer.complete();
                }
            });
        });
    }

    computeCache(rawData: any, resAsset) {
        if (!rawData) return;
        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions('Worth', 'value'));

        let dataProvider = [];
        let tmp = {};
        let lastDate = "", yesterDate = "";
        for (let i = 0; i < this.cache.raw.length; i++) {
            if (!tmp[this.cache.raw[i].date])
                tmp[this.cache.raw[i].date] = 0;

            tmp[this.cache.raw[i].date] += this.cache.raw[i].value;

            if (this.cache.raw[i].date != lastDate) {
                yesterDate = lastDate;
                lastDate = this.cache.raw[i].date;
            }

        }

        // used to check if cached date is updated
        this.cache.lastComputedDate = lastDate;

        for (let y in tmp) {
            dataProvider.push({
                date: y,
                value: Math.round(tmp[y] * 100) / 100,
            });
        }
        this.cache.chartOptions = ChartUtils.getOptions(dataProvider, graphOptions);

        //get worth and prof/loss
        if (dataProvider.length == 0) {
            this.cache.worth = RoboAdviceConfig.DefaultInitialWorth;
            this.cache.profLoss = 0;
        } else {
            this.cache.worth = dataProvider[dataProvider.length - 1][graphOptions[0].valueField];
            if (dataProvider.length > 1) {
                this.cache.profLoss = this.cache.worth - dataProvider[dataProvider.length - 2][graphOptions[0].valueField];
            } else {
                this.cache.profLoss = 0;
            }
        }

        //get Portfolio
        let lastDay = this.cache.raw.filter((el) => {
            return el.date == lastDate;
        });

        let lastDayYesterday = [];
        if (yesterDate != "") {
            lastDayYesterday = this.cache.raw.filter((el) => {
                return el.date == yesterDate;
            });
        }

        this.cache.portfolio.assets = [];
        for (let i = 0; i < lastDay.length; i++) {
            let snap = new AssetSnapshot();
            snap.value = lastDay[i].value;
            snap.assetClass = resAsset.data[lastDay[i].assetClassId];
            if (yesterDate && lastDayYesterday[i]) {
                snap.profLoss = lastDay[i].value - lastDayYesterday[i].value;
                snap.percentage = (lastDay[i].value / lastDayYesterday[i].value) - 1;
            } else {
                snap.profLoss = 0;
                snap.percentage = null;
            }
            this.cache.portfolio.assets.push(snap);
        }
    }


}

class DemoCache {
    constructor () {
        this.portfolio = new Portfolio();
        this.worth = RoboAdviceConfig.DefaultInitialWorth;
        this.profLoss = 0;
        let d = new Date();
        d.setDate(d.getDate() - 1);
        d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    }
    raw: any;
    chartOptions: any;
    worth: number;
    portfolio: Portfolio;
    profLoss: number;
    lastComputedDate: string;
}