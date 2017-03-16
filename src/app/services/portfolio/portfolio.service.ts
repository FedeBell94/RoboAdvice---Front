import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import {PortfolioCache} from "../../model/portfolio/portfolio-cache";
import {GenericResponse} from "../remote/remote-call/generic-response";
import {AssetService} from "../asset/asset.service";
import {GraphDynamicOptions} from "../../model/graph/graph-dynamic-options";
import {AssetSnapshot} from "../../model/portfolio/asset-snapshot";
import {ChartUtils} from "../../model/graph/charts-options";

@Injectable()
export class PortfolioService {
    constructor(
        private apis: ApiService,
        private assetService: AssetService,
    ) { }

    private cache: PortfolioCache = new PortfolioCache();
    private pending: Observable<GenericResponse>;

    clearCache() {
        this.cache = new PortfolioCache();
        this.pending = null;
    }

    getCached(field: string) {
        if (this.cache[field]) return this.cache[field];
        return null;
    }

    getPortfolio(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.downloadWorthHistory, "portfolio");
    }

    getProfLoss(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.downloadWorthHistory, "profLoss");
    }

    getWorth(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.downloadWorthHistory, "worth");
    }

    getWorthHistoryOptions(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.downloadWorthHistory, "worthHistoryOptions");
    }

    private cacheOrDownload(func: Function, field: string): Observable<GenericResponse> {
        if (this.cache[field]) {
            //data already there
            return Observable.create(observer=> {
                        observer.next(new GenericResponse(1, 0, "", this.cache[field]));
                        observer.complete();
                    });
        }
        //let's call the api
        return func.bind(this)().map(res=> {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache[field]);
                    }
                    return res;
                });
    }

    private downloadWorthHistory(): Observable<GenericResponse> {
        if (!this.pending) {
            this.pending = Observable.create(observer => {
                // in this api we can set a parameter {from: 'YYYY-MM-DD'}
                this.apis.get("portfolio", {}).subscribe((resPortfolio)=> {
                    if (resPortfolio.response > 0) {
                        this.assetService.getAssets().subscribe((resAsset) => {
                            if (resAsset.response > 0) {
                                this.computeCache(resPortfolio, resAsset);
                                observer.next(new GenericResponse(1, 0, "", "OK"));
                            }else{
                               observer.next(resAsset);
                            }
                            observer.complete();
                        });
                    }else{
                        observer.next(resPortfolio);
                        observer.complete();
                    }
                });
            });
        }
        return this.pending;
    }

    private computeCache(resPortfolio: GenericResponse, resAsset: GenericResponse){
        //saving raw data for future purposes
        this.cache.raw = resPortfolio.data;

        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions('Worth', 'value'));

        let dataProvider = [];
        let tmp = {};
        let lastDate = "", yesterDate = "";
        for (let i = 0; i < resPortfolio.data.length; i++){
            if (!tmp[resPortfolio.data[i].date])
                tmp[resPortfolio.data[i].date] = 0;

            tmp[resPortfolio.data[i].date] += resPortfolio.data[i].value;

            if (resPortfolio.data[i].date != lastDate) {
                yesterDate = lastDate;
                lastDate = resPortfolio.data[i].date;
            }

        }

        for (let y in tmp){
            dataProvider.push({
                date: y,
                value: Math.round(tmp[y] * 100) / 100,
            });
        }
        this.cache.worthHistoryOptions = ChartUtils.getOptions(dataProvider, graphOptions);

        console.log("opts: ", this.cache.worthHistoryOptions);

        //get worth and prof/loss
        if (dataProvider.length == 0) {
            this.cache.worth = 10000;
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
        let lastDay = resPortfolio.data.filter((el) => {
            return el.date == lastDate;
        });

        let lastDayYesterday = [];
        if (yesterDate != "") {
            lastDayYesterday = resPortfolio.data.filter((el) => {
                return el.date == yesterDate;
            });
        }

        for (let i = 0; i < lastDay.length; i++){
            let snap = new AssetSnapshot();
            snap.value = lastDay[i].value;
            snap.assetClass = resAsset.data[lastDay[i].assetClassId];
            if (yesterDate && lastDayYesterday[i]){
                snap.profLoss = lastDay[i].value - lastDayYesterday[i].value;
                snap.percentage = (lastDay[i].value / lastDayYesterday[i].value) - 1;
            }else{
                snap.profLoss = 0;
                snap.percentage = null;
            }
            this.cache.portfolio.assets.push(snap);
        }
    }
}

