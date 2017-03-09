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
            "color": "#fff",
            "fontFamily": "Roboto",
            "type": "serial",
            "categoryField": "date",
            "dataDateFormat": "YYYY-MM-DD",
            "autoMarginOffset": 12,
            "colors": [
                "#3c4eb9",
                "#1b70ef",
                "#00abff",
                "#0D8ECF"
            ],
            "fontSize": 12,
            "categoryAxis": {
                "parseDates": true,
                "ignoreAxisWidth": true
            },
            "chartCursor": {
                "enabled": true,
                "bulletsEnabled": true
            },
            "graphs": this.getGraphs(),
            "valueAxes": [
                {
                    "id": "ValueAxis-1"
                }
            ],
            "balloon": {},
            "legend": {
                "enabled": true,
                "color": "#fff"
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": "Portfolio History"
                }
            ],
            "dataProvider": this.cachedData.data
        };
    }

    private getGraphs() {
        return [{
            "type": "smoothedLine",
            "fillAlphas": 0.6,
            "id": "AmGraph-1",
            "lineAlpha": 0,
            "title": "Bonds",
            "valueField": "column1"
        },
        {
            "type": "smoothedLine",
            "fillAlphas": 0.6,
            "id": "AmGraph-2",
            "lineAlpha": 0,
            "title": "Forex",
            "valueField": "column2"
        },
        {
            "type": "smoothedLine",
            "fillAlphas": 0.6,
            "id": "AmGraph-3",
            "lineAlpha": 0,
            "title": "Stocks",
            "valueField": "column3"
        },
        {
            "type": "smoothedLine",
            "fillAlphas": 0.6,
            "id": "AmGraph-4",
            "lineAlpha": 0,
            "title": "Commodities",
            "valueField": "column4"
        }];
        /*
        let g = [];
        for (let i = 0; i < this.cachedData.graphs.length; i++) {
            g.push({
                    "type": "smoothedLine",
                    "fillAlphas": 0.7,
                    "id": "AmGraph-1",
                    "lineAlpha": 0,
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
