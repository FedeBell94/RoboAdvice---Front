import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit{
    constructor(
    ) { }
    @Input() data: any;
    private id: string;
    private options: any;

    ngOnInit() {
        this.id = 'chartdiv';
        this.options = this.data;
    }


}
