import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../services/remote/authentication.service";
import { StrategyService } from "../../services/strategy/strategy.service";
import { PortfolioService } from "../../services/portfolio/portfolio.service";

import {Asset} from "../../model/strategy/asset";
import {Portfolio} from "../../model/portfolio/portfolio";

import {RoboAdviceConfig} from "../../app.configuration";

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html',
    styleUrls: ['main-view.style.css']
})
export class mainViewComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private router: Router,
        private strategyService: StrategyService,
        private portfolioService: PortfolioService,
    ) { }

    //Used into html to import configs.
    private roboAdviceConfig = RoboAdviceConfig;

    @ViewChild('strategyPieChart') pieChart: any;

    private strategyValues: number[] = [25, 25, 25, 25];

    worthHistoryOptions: any;
    portfolio: any;

    getPortfolio(): Portfolio {
        return this.portfolio;
    }

    ngOnInit() {
        if (!this.auth.isLogged()) {
            this.router.navigate(["login"]);
            return;
        }
        if (this.auth.getUser().newUser) {
            this.router.navigate(["survey"]);
            return;
        }
        this.strategyService.getStrategy().subscribe((data) => {
            if (data.response > 0) {
                let i: number = 0;
                for (let assetClass of data.data as Asset[]) {
                    this.strategyValues[i] = assetClass.percentage;
                    i++;
                }
            }
        });
        this.portfolioService.getWorthHistoryOptions().subscribe((data) => {
            if (data.response > 0) {
                this.worthHistoryOptions = data.data;
            }
        });
        this.portfolioService.getPortfolio().subscribe((data) => {
            if (data.response > 0) {
                this.portfolio = data.data;
            }
        });
    }


    showAsset(a_C: number) {
      this.router.navigate(["/minorView", a_C, this.roboAdviceConfig.AssetClassLabel[a_C]]);
    }
}
