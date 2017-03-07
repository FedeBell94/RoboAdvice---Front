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
    }
}
