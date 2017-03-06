import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';

@Component({
    selector: "area-chart",
    templateUrl: 'app/components/area-chart.template.html',
    styleUrls: ['app/components/area-chart.style.css']
})
export class AreaChartComponent {
    constructor(
    ) { }
    @Input() values: number[][] = [[11, 12, 13, 8, 10, 15, 18]];
    @Input() colors: string[] | CanvasGradient[] | CanvasPattern[] = ["#3c4eb9", "#1b70ef", "#00abff", "#40daf1"];
    private id: string;
    private options: any;
    ngOnInit() {
        this.id = "chartdiv";

        this.options = {
            "type": "serial",
            "categoryField": "date",
            "dataDateFormat": "YYYY-MM-DD",
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
            "categoryAxis": {
                "parseDates": true,
                "ignoreAxisWidth": true
            },
            "chartCursor": {
                "enabled": true
            },
            "trendLines": [],
            "graphs": [
                {
                    "fillAlphas": 0.7,
                    "id": "AmGraph-1",
                    "lineAlpha": 0,
                    "title": "Bonds",
                    "valueField": "column-1"
                },
                {
                    "fillAlphas": 0.7,
                    "id": "AmGraph-2",
                    "lineAlpha": 0,
                    "title": "Forex",
                    "valueField": "column-2"
                },
                {
                    "fillAlphas": 0.7,
                    "id": "AmGraph-3",
                    "lineAlpha": 0,
                    "title": "Stocks",
                    "valueField": "column-3"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "ValueAxis-1"
                }
            ],
            "allLabels": [],
            "balloon": {},
            "legend": {
                "enabled": true
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