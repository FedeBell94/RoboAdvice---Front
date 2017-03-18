import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";

import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";
import { AssetCache } from "../../model/asset/asset-cache";

@Injectable()
export class AssetService {
  constructor(
    private apis: ApiService,
  ) {}

  /* properties */
  @LocalStorage() private cache: AssetCache;

  private pending: Observable<GenericResponse> = null;
  private observers = [];

  /* methods */

  public wipeCache(){
      this.cache = null;
      this.observers = [];
      this.pending = null;
  }

  public getAssetHistory(type: number): Observable<GenericResponse> {
    if (!this.cache) this.cache = new AssetCache();
    if (this.cache.history[type]) { 
          // data already there
          // check if data is up to date
          let todayDateString = new Date().toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
          let oldDate = new Date(this.cache.lastStoredDate);
          let todayDate = new Date(todayDateString);
          if (+oldDate < +todayDate) {
              // I need to update cached data
              return this.getObservable(type).map((res) => {
                  if (res.response > 0) {
                      return new GenericResponse(1, 0, "", ChartUtils.getOptions(this.cache.history[type], [new GraphDynamicOptions("xxx", "value")]));
                  }
                  return res;
              });
          }

          // data is up to date
          return Observable.create(observer => {
              observer.next(new GenericResponse(1, 0, "", ChartUtils.getOptions(this.cache.history[type], [new GraphDynamicOptions("xxx", "value")])));
              observer.complete();
          });
     
    }
    //if not
    return this.apis.get("assetClassHistory", {assetClassId: type}).map((data:any)=> {
        if (data.response > 0) {
            this.cache.history[type] = data.data;
            this.cache.lastStoredDate = data.data[data.data.length-1].date;

            this.cache = JSON.parse(JSON.stringify(this.cache));
            // used to check if cached date is updated
            data.data = ChartUtils.getOptions(this.cache.history[type], [new GraphDynamicOptions("xxx", "value")]);
        }
        return data;
      }, this);
  }

  private getObservable(type: number): Observable<GenericResponse> {
        //creating the Observable only once 
        if (!this.pending) {
            this.pending = this.performRequest(type);
        }
        return this.pending;
  }

  private performRequest(type: number): Observable<GenericResponse> {
        return Observable.create(observer => {
            //adding observer to my subscripionist list
            this.observers.push(observer);

            //if I'm not the first, I don't need to call the server
            if (this.observers.length > 1) return;

            //If I'm the first one, Let's get the call
            this.apis.get("assetClassHistory", {
                      assetClassId: type,
                      from: this.cache.lastStoredDate
                    })
              .subscribe((data: GenericResponse) => {
                  if (data.response > 0) {
                      // if server has up to date data
                      if (data.data.length > 0) {
                          // updating lastStoredDate
                          this.cache.lastStoredDate = data.data[data.data.length-1].date;
                          if (!this.cache.history) this.cache.history = [];
                          this.cache.history[type] = this.cache.history[type].concat(data.data);
                          this.cache = JSON.parse(JSON.stringify(this.cache));
                      }
                  }
                  //now let's wake up all my subscribers!
                  for (let i = 0; i < this.observers.length; i++) {
                      this.observers[i].next(data);
                      this.observers[i].complete();
                  }
                  this.observers = [];
            });
                
        });
  }

  public getAssets(): Observable<GenericResponse> {
    if (!this.cache) this.cache = new AssetCache();
    if (this.cache.assetsName.length > 0) { //if i have something in cache
      return Observable.create(observer => {
          observer.next( new GenericResponse(1, 0, "", this.cache.assetsName) );
          observer.complete();
      });
    }
    //if not
    return this.apis.get("assetClass", {}).map((data: GenericResponse)=> {
      if (data.response > 0) {
        let tmp = [];
        for(let i = 0; i < data.data.length; i++){
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