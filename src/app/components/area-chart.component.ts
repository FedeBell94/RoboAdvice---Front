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
    @Input() colors: string[] = ["#3c4eb9", "#1b70ef", "#00abff", "#40daf1"];
    @Input() data: any;
    private id: string;
    private options: any;

    ngOnInit() {
        this.id = "chartdiv";

        this.options = this.data || this.getNewOptions();
    }

    private getNewOptions() {
        return {
            "type": "serial",
            "categoryField": "date",
            "dataDateFormat": "YYYY-MM-DD",
            "colors": this.colors,
            "categoryAxis": {
                "parseDates": true,
                "ignoreAxisWidth": true
            },
            "chartCursor": {
                "enabled": true
            },
            "graphs": [
                {
                    "fillAlphas": 0.7,
                    "id": "AmGraph-1",
                    "lineAlpha": 0,
                    "title": "Bonds",
                    "valueField": "c1"
                },
                {
                    "fillAlphas": 0.7,
                    "id": "AmGraph-2",
                    "lineAlpha": 0,
                    "title": "Forex",
                    "valueField": "c2"
                }
            ],
            "valueAxes": [
                {
                    "id": "ValueAxis-1"
                }
            ],
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
                    "c1": 8,
                    "c2": 5
                },
                {
                    "date": "2014-03-02",
                    "c1": 6,
                    "c2": 7
                },
                {
                    "date": "2014-03-03",
                    "c1": 2,
                    "c2": 3
                },
                {
                    "date": "2014-03-04",
                    "c1": 1,
                    "c2": 3
                }
            ]
        };
    }


}