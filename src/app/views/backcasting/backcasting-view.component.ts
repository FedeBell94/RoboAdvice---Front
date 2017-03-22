import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";
import { BackcastingService } from "../../services/backcasting/backcasting.service";

@Component({
    selector: 'backcastingView',
    templateUrl: 'backcasting-view.template.html',
    styleUrls: ['backcasting-view.style.css']
})
export class backcastingViewComponent {
    constructor(
        private backcastingService: BackcastingService,
    ) { }

    private roboAdviceConfig = RoboAdviceConfig;

    backcastingData: any;

    ngOnInit() {
    }

    onPreviewClick(str: Strategy, from: string){
        this.getBackcasting(str, from);
    }

    getBackcasting(str: Strategy, from: string){
        this.backcastingService.getBackcastingSimulation(str, from).subscribe((res)=>{
            if (res.response > 0) {
                this.backcastingData = res.data;
            }
        });
    }
}
