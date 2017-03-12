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
    private sumAssetClasses(portfolio: any) {
        let sum = 0;
        for (let col in portfolio) {
            if (typeof portfolio[col] == typeof 0) sum += portfolio[col];
        }
        return sum;
    }

    private cache: PortfolioCache = new PortfolioCache();

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

    private downloadWorthHistory(): Observable<GenericResponse> {
        return this.apis.get("worthHistory").map((res)=> {
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
            "legend": {
                "enabled": true
            },
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
}

export class PortfolioRawCache {
    worthHistory: any;
}