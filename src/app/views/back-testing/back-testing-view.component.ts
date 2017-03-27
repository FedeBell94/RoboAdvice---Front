import { Component, ViewChild, ElementRef } from '@angular/core';
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

    @ViewChild("previewButton") previewButton: ElementRef;

    startingDate: string;

    backTestingData: any;

    currentStrategy: Strategy;

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

    onPreviewClick(from: string){
        this.getBackTesting(from); 
    }

    onChooseClick(str: Strategy){
        this.currentStrategy = str;
        this.previewButton.nativeElement.disabled = false;
        (window as any).swal('Done!', 'Strategy selected', 'success');
    }

    getBackTesting(from: string){
        this.backTestingData = null;
        this.previewButton.nativeElement.disabled = true;
        this.textPreview = "Loading data...";
        this.backTestingService.getBackTestingSimulation(this.currentStrategy, from).subscribe((res)=>{
            if (res.response > 0) {
                this.backTestingData = res.data;
            }else{
                this.textPreview = res.data;
            }
            this.previewButton.nativeElement.disabled = false;
        });
    }
}