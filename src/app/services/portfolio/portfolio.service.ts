import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { PortfolioCache } from "../../model/portfolio/portfolio-cache";
import { GenericResponse } from "../remote/remote-call/generic-response";
import { AssetService } from "../asset/asset.service";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";
import { AssetSnapshot } from "../../model/portfolio/asset-snapshot";
import { ChartUtils } from "../../model/graph/charts-options";
import { Portfolio } from "../../model/portfolio/portfolio";

import { LocalStorage } from "../../annotations/local-storage.annotation";
import { AtomicAsync } from "../../annotations/atomic.annotation";

import { RoboAdviceConfig } from '../../app.configuration';

@Injectable()
export class PortfolioService {
    constructor(
        private apis: ApiService,
        private assetService: AssetService,
    ) { }

    /* properties */
    @LocalStorage() private cache: PortfolioCache;
    private pending: { history: Observable<GenericResponse>, updateCache: Observable<GenericResponse> } = { history: null, updateCache: null };
    private observers = { history: [], update: [] };

    /* methods */

    public wipeCache() {
        this.cache = new PortfolioCache();
        this.pending.history = null;
        this.pending.updateCache = null;
        this.observers = { history: [], update: [] };
    }

    public getCached(field: string) {
        if (this.cache && this.cache[field]) return this.cache[field];
        return null;
    }

    public getPortfolio(): Observable<GenericResponse> {
        return this.cacheOrDownload("portfolio");
    }

    public getProfLoss(): Observable<GenericResponse> {
        return this.cacheOrDownload("profLoss");
    }

    public getWorth(): Observable<GenericResponse> {
        return this.cacheOrDownload("worth");
    }

    public getWorthHistoryOptions(): Observable<GenericResponse> {
        return this.cacheOrDownload("worthHistoryOptions");
    }

    private cacheOrDownload(field: string): Observable<GenericResponse> {
        if (!this.cache) this.cache = new PortfolioCache();
        if (this.cache[field]) {
            // data already there

            // check if data is up to date
            let todayDateString = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            let oldDate = new Date(this.cache.lastStoredDate);
            let todayDate = new Date(todayDateString);
            if (+oldDate < +todayDate) {
                // I need to update cached data
                return this.withAtomic().map((res) => {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache[field]);
                    }
                    return res;
                });
            }

            // data is up to date
            return Observable.create(observer => {
                observer.next(new GenericResponse(1, 0, "", this.cache[field]));
                observer.complete();
            });

        }
        //let's call the api
        return this.withAtomic().map(res => {
            if (res.response > 0) {
                return new GenericResponse(1, 0, "", this.cache[field]);
            }
            return res;
        });

    }
/*
    private getObservable(action: string): Observable<GenericResponse> {
        //creating the Observable only once 
        if (!this.pending[action]) {
            this.pending[action] = this.performRequest(action);
        }
        return this.pending[action];
    }

    private performRequest(action: string): Observable<GenericResponse> {
        return Observable.create(observer => {
            //adding observer to my subscripionist list
            this.observers[action].push(observer);

            //if I'm not the first, I don't need to call the server
            if (this.observers[action].length > 1) return;

            //If I'm the first one, Let's get the call
            this.assetService.getAssets().subscribe((resAsset) => {
                if (resAsset.response > 0) {
                    let params = undefined;
                    //now i got the assets, let's retrieve the data
                    if (this.cache.lastStoredDate) {
                        params = { from: this.cache.lastStoredDate};
                    }
                    this.apis.get("portfolio", params).subscribe((data: GenericResponse) => {
                        if (data.response > 0) {
                            // if server has up to date data
                            if (data.data.length > 0) {
                                if (!this.cache.raw) this.cache.raw = [];
                                this.cache.raw = this.cache.raw.concat(data.data);
                                //computing cache (synchronously)
                                this.computeCache(resAsset);
                            }
                        }
                        //now let's wake up all my subscribers!
                        for (let i = 0; i < this.observers[action].length; i++) {
                            this.observers[action][i].next(data);
                            this.observers[action][i].complete();
                        }
                        this.observers[action] = [];
                    });
                } else {
                    //error retrieving asset data
                    for (let i = 0; i < this.observers[action].length; i++) {
                        this.observers[action][i].next(resAsset);
                        this.observers[action][i].complete();
                    }
                    this.observers[action] = [];
                }
            });
        });
    }
*/
    private getData(action: string) {
        this.assetService.getAssets().subscribe((resAsset) => {
                if (resAsset.response > 0) {
                    let params = undefined;
                    //now i got the assets, let's retrieve the data
                    if (this.cache.lastStoredDate) {
                        params = { from: this.cache.lastStoredDate};
                    }
                    this.apis.get("portfolio", params).subscribe((data: GenericResponse) => {
                        if (data.response > 0) {
                            // if server has up to date data
                            if (data.data.length > 0) {
                                if (!this.cache.raw) this.cache.raw = [];
                                this.cache.raw = this.cache.raw.concat(data.data);
                                //computing cache (synchronously)
                                this.computeCache(resAsset);
                            }
                        }
                        //now let's wake up all my subscribers!
                        for (let i = 0; i < this.observers[action].length; i++) {
                            this.observers[action][i].next(data);
                            this.observers[action][i].complete();
                        }
                        this.observers[action] = [];
                    });
                } else {
                    //error retrieving asset data
                    for (let i = 0; i < this.observers[action].length; i++) {
                        this.observers[action][i].next(resAsset);
                        this.observers[action][i].complete();
                    }
                    this.observers[action] = [];
                }
            });
    }


    @AtomicAsync("history")
    private withAtomic(): Observable<GenericResponse> {
        return Observable.create(observer=> {
            //computng the requests
            this.assetService.getAssets().subscribe((resAsset) => {
                if (resAsset.response > 0) {
                    let params = undefined;
                    //now i got the assets, let's retrieve the data
                    if (this.cache.lastStoredDate) {
                        params = { from: this.cache.lastStoredDate};
                    }
                    this.apis.get("portfolio", params).subscribe((data: GenericResponse) => {
                        if (data.response > 0) {
                            // if server has up to date data
                            if (data.data.length > 0) {
                                if (!this.cache.raw) this.cache.raw = [];
                                this.cache.raw = this.cache.raw.concat(data.data);
                                //computing cache (synchronously)
                                this.computeCache(resAsset);
                            }
                        }
                        //now let's return data!
                        observer.next(data);
                        observer.complete();
                        
                    });
                } else {
                    //error retrieving asset data
                    observer.next(resAsset);
                    observer.complete();
                }
            });
        });
    }

    private computeCache(resAsset: GenericResponse) {
        // TODO: optimize / SoC ?

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
        this.cache.lastStoredDate = lastDate;

        for (let y in tmp) {
            dataProvider.push({
                date: y,
                value: Math.round(tmp[y] * 100) / 100,
            });
        }
        this.cache.worthHistoryOptions = ChartUtils.getOptions(dataProvider, graphOptions);

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

        //applying modify to save the data into LocalStorage
        this.cache = JSON.parse(JSON.stringify(this.cache));
    }

}