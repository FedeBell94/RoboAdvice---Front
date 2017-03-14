import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../remote/remote-call/remote-call.service';

@Injectable()
export class AssetService {
  constructor(
    private apis: ApiService,
  ) {}

  private cachedAssets: {} = {};
  private idCounter = 0;


  public getAssetHistory(type: number): Observable<any> {
    if (this.cachedAssets[type]) { //if i have something in cache
      return Observable.create(observer => {
        setTimeout(()=> {
          observer.next(
            {
              response: 1,
              errorCode: 0,
              errorString: "",
              data: this.getChartOptions(this.cachedAssets[type])
            });
          observer.complete();
        }, 10);
      });
    }
    //if not
    return this.apis.get("assetClassHistory", {assetClassId: type}).map((data:any)=> {
        if (data.response > 0) {
          this.cachedAssets[type] = data.data;
          data.data = this.getChartOptions(this.cachedAssets[type]);
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
