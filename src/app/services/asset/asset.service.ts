import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";

import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";
import { AssetCache } from "../../model/asset/asset-cache";
import { AtomicAsync } from "../../annotations/atomic.annotation";

@Injectable()
export class AssetService {
    constructor(
        private apis: ApiService,
    ) { }

    /* properties */
    @LocalStorage() private cache: AssetCache;
    private observers = { history: [], update: [] };

    /* methods */

    public wipeCache() {
        this.cache = new AssetCache();
        this.observers = { history: [], update: [] };
    }

    public getAssetHistory(type: number): Observable<GenericResponse> {
        if (!this.cache) this.cache = new AssetCache();
        if (this.cache.history[type]) {
            // data already there
            // check if data is up to date
            let todayDateString = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            let oldDate = new Date(this.cache.lastStoredDate[type]);
            let todayDate = new Date(todayDateString);
            if (+oldDate < +todayDate) {
                // I need to update cached data
                return this.performRequest(type).map((res) => {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache.history[type]);
                    }
                    return res;
                });
            }

            // data is up to date
            return Observable.create(observer => {
                observer.next(new GenericResponse(1, 0, "", this.cache.history[type]));
                observer.complete();
            });

        }
        //if not
        //let's call the api
        return this.performRequest(type).map(res => {
            if (res.response > 0) {
                return new GenericResponse(1, 0, "", this.cache.history[type]);
            }
            return res;
        });
    }

    @AtomicAsync(0) //using first parameter as unique id for observable
    private performRequest(type: number): Observable<GenericResponse> {
        return Observable.create(observer => {

            let params = {assetClassId: type};
            //now i got the assets, let's retrieve the data
            if (this.cache.lastStoredDate[type]) {
                params['from'] = this.cache.lastStoredDate[type];
                
            }

            //If I'm the first one, Let's get the call
            this.apis.get("assetClassHistory", params).subscribe((data: GenericResponse) => {
                if (data.response > 0) {
                    // if server has up to date data
                    if (data.data.length > 0) {
                        if (!this.cache.raw) this.cache.raw = [];
                        if (!this.cache.raw[type]) this.cache.raw[type] = [];
                        this.cache.raw[type] = this.cache.raw[type].concat(data.data);
                        //computing cache (synchronously)
                        this.computeCache(type);
                    }
                }
                observer.next(data);
                observer.complete();
            });

        });
    }

    private computeCache(type: number) {
        // updating lastStoredDate
        this.cache.lastStoredDate[type] = this.cache.raw[type][this.cache.raw[type].length - 1].date;

        let graphOptions = new Array<GraphDynamicOptions>();
        graphOptions.push(new GraphDynamicOptions(this.cache.assetsName[type], 'value'));

        let dataProvider = [];
        for (let i = 0; i < this.cache.raw[type].length; i++) {
            dataProvider.push({
                date: this.cache.raw[type][i].date,
                value: Math.round(this.cache.raw[type][i].value * 100) / 100,
            });
        }
        if (!this.cache.history) this.cache.history = [];
        this.cache.history[type] = ChartUtils.getOptions(dataProvider, graphOptions);
        this.cache = JSON.parse(JSON.stringify(this.cache));
    }

    public getAssets(): Observable<GenericResponse> {
        if (!this.cache) this.cache = new AssetCache();
        if (this.cache.assetsName.length > 0) { //if i have something in cache
            return Observable.create(observer => {
                observer.next(new GenericResponse(1, 0, "", this.cache.assetsName));
                observer.complete();
            });
        }
        //if not
        return this.apis.get("assetClass", {}).map((data: GenericResponse) => {
            if (data.response > 0) {
                let tmp = [];
                for (let i = 0; i < data.data.length; i++) {
                    tmp[data.data[i].id] = data.data[i].name;
                }
                this.cache.assetsName = tmp;
                this.cache = JSON.parse(JSON.stringify(this.cache));
                return new GenericResponse(1, 0, "", tmp);
            }
            return data;
        }, this);
    }

}