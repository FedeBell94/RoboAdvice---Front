import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

import { LocalStorage } from "../../annotations/local-storage.annotation";
import {GenericResponse} from "../remote/remote-call/generic-response";

@Injectable()
export class AssetService {
  constructor(
    private apis: ApiService,
  ) {}

  @LocalStorage() private cachedAssetsHistory;
  @LocalStorage() private cachedAssets;
  private idCounter = 0;

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
              data: this.getChartOptions(this.cachedAssetsHistory[type])
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
          data.data = this.getChartOptions(this.cachedAssetsHistory[type]);
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
    return this.apis.get("assetClassesName", {}).map((data: GenericResponse)=> {
      if (data.response > 0) {
        let tmp = [];
        for(let i = 0; i < data.data.length; i++){
          tmp[data.data[i].id] = data.data[i].name;
        }
        this.cachedAssets = tmp;
        this.cachedAssets = JSON.parse(JSON.stringify(this.cachedAssets));
        data.data = this.getChartOptions(this.cachedAssets);
        return new GenericResponse(1, 0, "", tmp);
      }
      return data;
    }, this);
  }

  private getChartOptions(data: Array<any>) {
    let id = this.idCounter++;
    return {
            "type": "serial",
            "theme": "none",
            "marginTop":0,
            "marginRight": 20,
            "colors": [
                "#369",
                "#639",
                "#693",
                "#963"
            ],
            "dataProvider": data,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": [{
                "id":"g" + this.idCounter,
                "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 4,
                "lineThickness": 1,
                "type": "smoothedLine",
                "valueField": "value",
                "title": "Bonds"
            }],
            "chartScrollbar": {
                "graph":"g" + this.idCounter,
                "gridAlpha":0,
                "color":"#888888",
                "scrollbarHeight":55,
                "backgroundAlpha":0,
                "selectedBackgroundAlpha":0.1,
                "selectedBackgroundColor":"#888888",
                "graphFillAlpha":0,
                "autoGridCount":true,
                "selectedGraphFillAlpha":0,
                "graphLineAlpha":0.2,
                "graphLineColor":"#c2c2c2",
                "selectedGraphLineColor":"#888888",
                "selectedGraphLineAlpha":1

            },
            "chartCursor": {
                "categoryBalloonDateFormat": "YYYY-MM-DD",
                "cursorAlpha": 0.9,
                "valueLineEnabled":true,
                "valueLineBalloonEnabled":true,
                "valueLineAlpha":0.5,
                "fullWidth":false
            },
            "dataDateFormat": "YYYY-MM-DD",
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "DD",
                "parseDates": true,
                "minorGridAlpha": 0.1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
        };
  }
}
