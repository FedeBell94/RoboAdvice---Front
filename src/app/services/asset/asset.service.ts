import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";

import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";
import { AssetCache } from "../../model/asset/asset-cache";
import { Pending } from "../../model/asset/pending";

@Injectable()
export class AssetService {
    constructor(
        private apis: ApiService,
    ) { }

    /* properties */
    @LocalStorage() private cache: AssetCache;
    private pending: Pending[];
    private observers = { history: [], update: [] };

    /* methods */

    public wipeCache() {
        this.cache = new AssetCache();
        this.observers = { history: [], update: [] };
        this.pending = new Array<Pending>();
    }

    public getAssetHistory(type: number): Observable<GenericResponse> {
        if (!this.cache) this.cache = new AssetCache();
        if (!this.pending) this.pending = new Array<Pending>();
        if (this.cache.history[type]) {
            // data already there
            // check if data is up to date
            let todayDateString = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            let oldDate = new Date(this.cache.lastStoredDate[type]);
            let todayDate = new Date(todayDateString);
            if (+oldDate < +todayDate) {
                // I need to update cached data
                return this.getObservable("update", type).map((res) => {
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
        return this.getObservable("history", type).map(res => {
            if (res.response > 0) {
                return new GenericResponse(1, 0, "", this.cache.history[type]);
            }
            return res;
        });
    }

    private getObservable(action: string, type: number): Observable<GenericResponse> {
        //creating the Observable only once 
        if (!this.pending[type]) this.pending[type] = new Pending();
        if (!this.pending[type][action]) {
            this.pending[type][action] = this.performRequest(action, type);
        }
        return this.pending[type][action];
    }

    private performRequest(action: string, type: number): Observable<GenericResponse> {
        return Observable.create(observer => {
            //adding observer to my subscripionist list
            this.observers[action].push(observer);

            //if I'm not the first, I don't need to call the server
            if (this.observers[action].length > 1) return;

            let params = {};
            //now i got the assets, let's retrieve the data
            if (action == "update") {
                params = {
                    assetClassId: type,
                    from: this.cache.lastStoredDate[type]
                };
            } else {
                params = {
                    assetClassId: type,
                };
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
                        this.computeCache(data, type);
                    }
                }
                //now let's wake up all my subscribers!
                for (let i = 0; i < this.observers[action].length; i++) {
                    this.observers[action][i].next(data);
                    this.observers[action][i].complete();
                }
                this.observers[action] = [];
            });

        });
    }

    private computeCache(res: GenericResponse, type: number) {
        // updating lastStoredDate
        this.cache.lastStoredDate[type] = res.data[res.data.length - 1].date;

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