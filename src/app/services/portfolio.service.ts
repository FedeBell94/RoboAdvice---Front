import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';

import { ApiService } from './remote/remote-call.service';
import { AuthService } from './remote/authentication.service';

@Injectable()
export class PortfolioService {
    constructor(
        private apis: ApiService,
        private router: Router,
    ) { }

    private cachedData: any;
    private cachedWorth: number;
    private cachedYesterdayWorth: number;
    private cachedPortfolioHistoryChartOptions: any;

    private getRemoteData(type: string) {
        return this.apis.get("portfolio").map(this.cacheData[type], this);
    }

    private sumAssetClasses(portfolio: any) {
        let sum = 0;
        for (let col in portfolio) {
            if (typeof portfolio[col] == typeof 0) sum += portfolio[col];
        }
        return sum;
    }

    private estractData(data: any) {
        this.cachedData = data.data;
        console.log(this.cachedData);

        //current worth
        if (this.cachedData.data.length > 0) this.cachedWorth = this.sumAssetClasses(this.cachedData.data[this.cachedData.data.length - 1]);  //ok
        else this.cachedWorth = 10000;
        console.log("current worth: ", this.cachedWorth);
        //yesterday's worth
        if (this.cachedData.data.length > 1) this.cachedYesterdayWorth = this.sumAssetClasses(this.cachedData.data[this.cachedData.data.length - 2]);
        else this.cachedYesterdayWorth = 10000;
        console.log("yesterday's worth: ", this.cachedYesterdayWorth);
        //options
        this.cachedPortfolioHistoryChartOptions = this.getOptions();
        //console.log("options: ", this.cachedPortfolioHistoryChartOptions);


    }

    private getOptions() {
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
            "legend": {
                "enabled": true
            },
            "dataProvider": this.cachedData.data,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "graphs": this.getGraphs(),
            "chartScrollbar": {
                "graph":"g1",
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

    private getGraphs() {
        return [{
                "id":"g1",
                "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 8,
                "lineThickness": 2,
                "type": "smoothedLine",
                "valueField": "column1",
                "title": "Bonds"
            },
            {
                "id":"g2",
                "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 8,
                "lineThickness": 2,
                "type": "smoothedLine",
                "valueField": "column2",
                "title": "Forex"
            },
            {
                "id":"g3",
                "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 8,
                "lineThickness": 2,
                "type": "smoothedLine",
                "valueField": "column3",
                "title": "Stocks"
            },
            {
                "id":"g4",
                "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 8,
                "lineThickness": 2,
                "type": "smoothedLine",
                "valueField": "column4",
                "title": "Commodities"
            }];
        /*
        let g = [];
        for (let i = 0; i < this.cachedData.graphs.length; i++) {
            g.push({
                    "id":"g4",
                    "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    "bullet": "round",
                    "bulletSize": 8,
                    "lineThickness": 2,
                    "type": "smoothedLine",
                    "title": this.cachedData.graphs[i].title,
                    "valueField": this.cachedData.graphs[i].valueField
                });
        }
        return g;*/
    }

    private cacheData = {
        "portfolioHistory": (data: any) => {
            this.estractData(data);
            return this.cachedPortfolioHistoryChartOptions;
        },
        "worth": (data: any) => {
            this.estractData(data);
            return this.cachedWorth;
        },
        "yesterdayWorth": (data: any) => {
            this.estractData(data);
            return this.cachedYesterdayWorth;
        }
    };

    forceDownolad() {
        return this.getRemoteData("portfolioHistory");
    }

    getLastPortfolio() {
      if (!this.cachedData) {
        this.forceDownolad();
        return null;
      }
      let ret: any[] = [];
      for (let i = 0; i < 4; i++) {
        let lastVal = (this.cachedData.data.length > 0 ? this.cachedData.data[this.cachedData.data.length -1][this.cachedData.graphs[i].valueField] : 0);
        let beforeLastVal = (this.cachedData.data.length > 1 ? lastVal - this.cachedData.data[this.cachedData.data.length -2][this.cachedData.graphs[i].valueField] : 0);
        ret.push({
          assetClass: this.cachedData.graphs[i].title,
          value: lastVal,
          profLoss: beforeLastVal,
          percentage: beforeLastVal / lastVal
        });
      }
      return ret;
    }

    getWorth() {
        if (!this.cachedData) {
            this.getRemoteData("worth");
            return null;
        }
        return this.cachedWorth;
    }

    getYesterdayWorth() {
        if (!this.cachedData) {
            this.getRemoteData("yesterdayWorth");
            return null;
        }
        return this.cachedYesterdayWorth;
    }

    getProfLoss() {
        if (!this.cachedData) {
            this.getRemoteData("worth");
            return null;
        }
        return this.cachedWorth - this.cachedYesterdayWorth;
    }

    getCachedPortfolioHistoryChartOptions() {
        if (!this.cachedData) {
            this.getRemoteData("portfolioHistory");
            return null;
        }
        return this.cachedPortfolioHistoryChartOptions;
    }
}
