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

    getLastPortfolio() {
        return this.getRemoteData("portfolioHistory");
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
    /*
        getHistory() {
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
                    "#0D8ECF",
                    "#2A0CD0",
                    "#CD0D74",
                    "#CC0000",
                    "#00CC00",
                    "#0000CC",
                    "#DDDDDD",
                    "#999999",
                    "#333333",
                    "#990000"
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
                "graphs": [
                    {
                        "type": "smoothedLine",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-1",
                        "lineAlpha": 0,
                        "title": "Bonds",
                        "valueField": "column-1"
                    },
                    {
                        "type": "smoothedLine",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-2",
                        "lineAlpha": 0,
                        "title": "Forex",
                        "valueField": "column-2"
                    },
                    {
                        "type": "smoothedLine",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-3",
                        "lineAlpha": 0,
                        "title": "Stocks",
                        "valueField": "column-3"
                    }
                ],
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
                "dataProvider": [
                    {
                        "date": "2014-03-01",
                        "column-1": 8,
                        "column-2": 5,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-02",
                        "column-1": 6,
                        "column-2": 7,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-03",
                        "column-1": 2,
                        "column-2": 3,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-04",
                        "column-1": 1,
                        "column-2": 3,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-05",
                        "column-1": 2,
                        "column-2": 1,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-06",
                        "column-1": 3,
                        "column-2": 2,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-07",
                        "column-1": 6,
                        "column-2": 10,
                        "column-3": 4
                    },
                    {
                        "date": "2014-03-08",
                        "column-1": 9,
                        "column-2": 5,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-09",
                        "column-1": 5,
                        "column-2": 8,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-10",
                        "column-1": 6,
                        "column-2": 8,
                        "column-3": 2
                    },
                    {
                        "date": "2014-03-11",
                        "column-1": 4,
                        "column-2": 6,
                        "column-3": 6
                    }
                ]
            };
        }*/
}
