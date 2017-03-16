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
    private pending: {history: Observable<GenericResponse>, updateCache: Observable<GenericResponse>} = {history: null, updateCache: null};

    wipeCache() {
        this.cache = new PortfolioCache();
        this.pending.history = null;
        this.pending.updateCache = null;
    }

    getCached(field: string) {
        if (this.cache[field]) return this.cache[field];
        return null;
    }

    getPortfolio(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.getPortfolioHistory, "portfolio");
    }

    getProfLoss(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.getPortfolioHistory, "profLoss");
    }

    getWorth(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.getPortfolioHistory, "worth");
    }

    getWorthHistoryOptions(): Observable<GenericResponse> {
        return this.cacheOrDownload(this.getPortfolioHistory, "worthHistoryOptions");
    }

    private cacheOrDownload(func: Function, field: string): Observable<GenericResponse> {
        if (this.cache[field]) {
            // data already there

            // check if data is up to date
            let todayDateString = new Date().toLocaleDateString('eu', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g, '-');
            let oldDate = new Date(this.cache.lastStoredDate);
            let todayDate = new Date(todayDateString);
            if (+oldDate < +todayDate){
                // I need to update cached data
                return this.updateCacheAndGetField(field);
            }

            // data is up to date
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

    private updateCacheAndGetField(field: string): Observable<GenericResponse>{

        console.log("updateCacheAndGetField CALLED!");

        if (!this.pending.updateCache) {
            console.log("Updating cache");
            this.pending.updateCache = Observable.create((observer)=>{
                this.assetService.getAssets().subscribe((resAsset) => {
                    if (resAsset.response > 0) {
                        this.apis.get("portfolio", {from: this.cache.lastStoredDate}).map((data: GenericResponse)=>{
                            if (data.response > 0){
                                // if server has up to date data
                                if (data.data.length > 0) {
                                    console.log("There are data to up to date!");
                                    this.cache.raw.append(data.data);
                                    this.computeCache(new GenericResponse(1, 0, "", this.cache.raw), resAsset);
                                }else{
                                  console.log("NO DATA FROM SERVER to update portfolio cache");
                                }
                                observer.next(new GenericResponse(1, 0, "", this.cache[field]));
                            }else{
                                observer.next(data);
                            }
                            observer.complete();
                        });
                    } else {
                        observer.next(resAsset);
                        observer.complete();
                    }
                });
            });
        }
        return this.pending.updateCache;
    }

    private getPortfolioHistory(): Observable<GenericResponse> {
        if (!this.pending.history) {
            this.pending.history = this.downloadAllData();
        }
        return this.pending.history;
    }

    private downloadAllData(): Observable<GenericResponse>{
        return Observable.create(observer => {
            // in this api we can set a parameter {from: 'YYYY-MM-DD'}
            this.apis.get("portfolio", {}).subscribe((resPortfolio) => {
                if (resPortfolio.response > 0) {
                    this.assetService.getAssets().subscribe((resAsset) => {
                        if (resAsset.response > 0) {
                            this.computeCache(resPortfolio, resAsset);
                            observer.next(new GenericResponse(1, 0, "", "OK"));
                        } else {
                            observer.next(resAsset);
                        }
                        observer.complete();
                    });
                } else {
                    observer.next(resPortfolio);
                    observer.complete();
                }
            });
        });
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

        // used to check if cached date is updated
        this.cache.lastStoredDate = lastDate;

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

