import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";

import { GenericResponse } from "../remote/remote-call/generic-response";
import { ChartUtils } from "../../model/graph/charts-options";
import { GraphDynamicOptions } from "../../model/graph/graph-dynamic-options";

@Injectable()
export class AssetService {
  constructor(
    private apis: ApiService,
  ) {}

  @LocalStorage() private cachedAssetsHistory;
  @LocalStorage() private cachedAssets;

  public wipeCache(){
      this.cachedAssetsHistory = null;
      this.cachedAssets = null;
  }

  public getAssetHistory(type: number): Observable<GenericResponse> {
    if (!this.cachedAssetsHistory) this.cachedAssetsHistory = {};
    if (this.cachedAssetsHistory[type]) { //if i have something in cache
      return Observable.create(observer => {
        setTimeout(()=> {

          observer.next(
            {
              response: 1,
              errorCode: 0,
              errorString: "",
              data: ChartUtils.getOptions(this.cachedAssetsHistory[type], [new GraphDynamicOptions("xxx", "value")])
            });
          observer.complete();
        }, 10);
      });
    }
    //if not
    return this.apis.get("assetClassHistory", {assetClassId: type}).map((data:any)=> {
        if (data.response > 0) {
          this.cachedAssetsHistory[type] = data.data;
          this.cachedAssetsHistory = JSON.parse(JSON.stringify(this.cachedAssetsHistory));
          data.data = ChartUtils.getOptions(this.cachedAssetsHistory[type], [new GraphDynamicOptions("xxx", "value")]);
        }
        return data;
      }, this);
  }

  public getAssets(): Observable<GenericResponse> {
    // if (!this.cachedAssets) this.cachedAssets = [];
    if (this.cachedAssets) { //if i have something in cache
      return Observable.create(observer => {
        setTimeout(()=> {
          observer.next(
            {
              response: 1,
              errorCode: 0,
              errorString: "",
              data: this.cachedAssets
            });
          observer.complete();
        }, 10);
      });
    }
    //if not
    return this.apis.get("assetClass", {}).map((data: GenericResponse)=> {
      if (data.response > 0) {
        let tmp = [];
        for(let i = 0; i < data.data.length; i++){
          tmp[data.data[i].id] = data.data[i].name;
        }
        this.cachedAssets = tmp;
        return new GenericResponse(1, 0, "", tmp);
      }
      return data;
    }, this);
  }

}
