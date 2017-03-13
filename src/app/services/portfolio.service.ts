import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService, GenericResponse } from './remote/remote-call.service';
import { AuthService } from './remote/authentication.service';

@Injectable()
export class PortfolioService {
    constructor(
        private apis: ApiService,
        private router: Router,
    ) { }

    private cache: PortfolioCache = new PortfolioCache();
    private pending = { history: undefined, worth: undefined };

    clearCache() {
        this.cache = new PortfolioCache();
        this.pending = { history: undefined, worth: undefined };
    }

    getCached(field: string) {
        if (this.cache[field]) return this.cache[field];
        return null;
    }

    getPortfolio(): Observable<GenericResponse> {
        if (this.cache.portfolio) return Observable.create(observer=> {
                                    observer.next(new GenericResponse(1, 0, "", this.cache.portfolio));
                                    observer.complete();
                                });
        return this.downloadPerAssetTodayWorth().map(res=> {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache.portfolio);
                    }
                    return res;
                });  
    }

    getProfLoss(): Observable<GenericResponse> {
        if (this.cache.profLoss) return Observable.create(observer=> {
                                    observer.next(new GenericResponse(1, 0, "", this.cache.profLoss));
                                    observer.complete();
                                });
        return this.downloadWorthHistory().map(res=> {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache.profLoss);
                    }
                    return res;
                });  
    }

    getWorth(): Observable<GenericResponse> {
        if (this.cache.worth) {
            return Observable.create(observer=> {
                observer.next(new GenericResponse(1, 0, "", this.cache.worth));
                observer.complete();
            });
        }
        return this.downloadWorthHistory().map(res=> {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache.worth);
                    }
                    return res;
                });    //TODO: portfolio is faster
    }

    getWorthHistoryOptions(): Observable<GenericResponse> {
        if (this.cache.raw.worthHistory) {
            //data already there
            return Observable.create(observer=> {
                        observer.next(new GenericResponse(1, 0, "", this.cache.worthHistoryOptions));
                        observer.complete();
                    });
        } 
        //let's call the api
        return this.downloadWorthHistory().map(res=> {
                    if (res.response > 0) {
                        return new GenericResponse(1, 0, "", this.cache.worthHistoryOptions);
                    }
                    return res;
                });
    }

    private downloadPerAssetTodayWorth(): Observable<GenericResponse> {
        if (!this.pending.worth) {
            this.pending.worth = this.apis.get("worthDay").map((res)=> {
                if (res.response > 0) {
                    //saving raw data for future purposes
                    this.cache.raw.perAssetTodayWorth = res.data;
                    this.cache.portfolio = res.data;
                    this.cache.worth = this.getWorthFromPortfolio(this.cache.portfolio);
                }
                
                return res; 
            });
        }
        return this.pending.worth;
    }

    private downloadWorthHistory(): Observable<GenericResponse> {
        if (!this.pending.history) {
            this.pending.history = this.apis.get("worthHistory").map((res)=> {
                    if (res.response > 0) {
                        //saving raw data for future purposes
                        this.cache.raw.worthHistory = res.data;
                        this.cache.worthHistoryOptions = this.getOptions(res.data.data, this.getGraphs(res.data.graphs));
                        //get worth and prof/loss
                        if (res.data.data.length == 0) {
                            this.cache.worth = 10000;
                            this.cache.profLoss = 0;
                        } else {
                            this.cache.worth = res.data.data[res.data.data.length - 1][res.data.graphs[0].valueField];
                            if (res.data.data.length > 1) this.cache.profLoss = this.cache.worth - res.data.data[res.data.data.length - 2][res.data.graphs[0].valueField];
                            else this.cache.profLoss = 0;
                        }
                    } else {
                        //TODO: ?
                    }
                    return res;
                });
        }
        return this.pending.history;
    }

    private getWorthFromPortfolio(portfolio: Portfolio[]) {
        let sum = 0;
        for (let i = 0; i < portfolio.length; i++) {
            sum += portfolio[i].value;
        }
        return sum;
    }

    private getGraphs(opts) {
        let g = [];
        for (let i = 0; i < opts.length; i++) {
            g.push({
                    "id":"g" + i,
                    "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                    "bullet": "round",
                    "bulletSize": 8,
                    "lineThickness": 2,
                    "type": "smoothedLine",
                    "title": opts[i].title,
                    "valueField": opts[i].valueField
                });
        }
        return g;
    }

    private getOptions(data: any[], graphs: any) {
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
            "graphs": graphs,
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

export class PortfolioCache {
    constructor() {
        this.raw = new PortfolioRawCache();
    }
    raw: PortfolioRawCache;
    worthHistoryOptions: any;
    worth: number;
    profLoss: number;
    portfolio: any;
}

export class PortfolioRawCache {
    worthHistory: any;
    perAssetTodayWorth: any;
}

export class Portfolio {
    assetClass: string;
    value: number;
    profLoss: number;
    percentage: number;
}