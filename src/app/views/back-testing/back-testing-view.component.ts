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

    ngOnInit() {
        let tmp = new Date();
        this.startingDate = tmp.toLocaleDateString('eu', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    }

    checkDate(date: string){
        // check the Date
        let n = new Date(date);
        let t = new Date();
        if (+n >= +t){
            return;
        }
    }

    onPreviewClick(str: Strategy, from: string){
        this.getBackTesting(str, from); 
    }

    getBackTesting(str: Strategy, from: string){
        this.backTestingService.getBackTestingSimulation(str, from).subscribe((res)=>{
            if (res.response > 0) {
                this.backTestingData = res.data;
            }
        });
    }
}