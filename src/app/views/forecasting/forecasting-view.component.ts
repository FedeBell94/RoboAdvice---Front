import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RoboAdviceConfig } from "../../app.configuration";
import { Strategy } from "../../model/strategy/strategy";

@Component({
    selector: 'forecastingView',
    templateUrl: 'forecasting-view.template.html',
    styleUrls: ['forecasting-view.style.css']
})
export class forecastingViewComponent {
    constructor(
    ) { }

    private roboAdviceConfig = RoboAdviceConfig;


}