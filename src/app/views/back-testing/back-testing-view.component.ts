import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";
import { BackTestingService } from "../../services/back-testing/back-testing.service";

@Component({
    selector: 'backTestingView',
    templateUrl: 'back-testing-view.template.html',
    styleUrls: ['back-testing-view.style.css']
})
export class backTestingViewComponent {
    constructor(
        private backTestingService: BackTestingService,
    ) { }

    private roboAdviceConfig = RoboAdviceConfig;

    startingDate: string;

    backTestingData: any;

    textPreview: string = "Click on Preview button to see chart preview";

    ngOnInit() {
        let tmp = new Date();
        tmp.setDate(tmp.getDate()-1);
        this.startingDate = tmp.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    }

    getChartOptions(){
        return this.backTestingData;
    }

    checkDate(e: any){
        //check the Date
        let d = new Date();
        d.setDate(d.getDate() - 1);
        if (e.target.value > d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')) {
            e.target.value = d.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
        } else {
            this.startingDate = e.target.value;
        }
    }

    onPreviewClick(str: Strategy, from: string){
        this.getBackTesting(str, from); 
    }

    getBackTesting(str: Strategy, from: string){
        this.backTestingData = null;
        this.textPreview = "Loading data...";
        this.backTestingService.getBackTestingSimulation(str, from).subscribe((res)=>{
            if (res.response > 0) {
                this.backTestingData = res.data;
            }
        });
    }
}