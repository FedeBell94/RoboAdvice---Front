/**
 * Created by cicca on 10/03/2017.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './remote/remote-call.service';

@Injectable()
export class AssetService {
  constructor(private apis: ApiService,
              private router: Router,) {
  }

  private cachedAssets: {};
    private idCounter = 0;


  private downoladAssetsHistory(type: string) {
    if (this.cachedAssets[type]) return Observable.create((observer => {
      observer.next(this.getChartOptions(this.cachedAssets[type]));
      observer.complete();
    }))
    return this.apis.get("assetHistory", {assetClassId: type}).map((data:any)=> {
      this.cachedAssets[type] = data;
      return this.getChartOptions(this.cachedAssets[type]);
    }, this);
  }

  private getChartOptions(data: any) {
    let id = this.idCounter++;
    return {
      "type": "serial",
      "theme": "none",
      "marginTop":0,
      "marginRight": 20,
      "dataProvider": data,
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "graphs": [{
        "id":"g" + id,
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "valueField": "value"
      }],
      "chartScrollbar": {
        "graph":"g" +id,
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
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
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
