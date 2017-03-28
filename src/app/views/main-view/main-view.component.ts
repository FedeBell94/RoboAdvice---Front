import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

import { AuthService } from "../../services/remote/authentication.service";
import { PortfolioService } from "../../services/portfolio/portfolio.service";

import { Portfolio } from "../../model/portfolio/portfolio";

import { RoboAdviceConfig } from "../../app.configuration";
import { StrategyService } from "../../services/strategy/strategy.service";

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html',
    styleUrls: ['main-view.style.css']
})
export class mainViewComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private router: Router,
        private portfolioService: PortfolioService,
        private strategy: StrategyService,
    ) { }

    //Used into html to import configs.
    private roboAdviceConfig = RoboAdviceConfig;

    @ViewChild('strategyPieChart') pieChart: any;

    worthHistoryOptions: any;
    portfolio: any;
    advices: number[];

    getPortfolio(): Portfolio {
        return this.portfolio;
    }

    getAdvices(): number[]{
        return this.advices;
    }

    ngOnInit() {
        if (!this.isLogged()) {
            this.router.navigate(["login"]);
            return;
        }
        if (this.auth.getUser().isNewUser) {
            this.router.navigate(["survey"]);
            return;
        }

        this.strategy.getSomeAdvice().subscribe((res) => {
            if (res.response > 0){
                this.advices = res.data;
            }
        });

        this.portfolioService.getWorthHistoryOptions().subscribe((res) => {
            if (res.response > 0) {
                this.worthHistoryOptions = res.data;
            }
        });

        this.portfolioService.getPortfolio().subscribe((res) => {
            if (res.response > 0) {
                this.portfolio = res.data;
            }
        });

    }

    isLogged() {
        return this.auth.isLogged();
    }

    showAsset(a_C: number) {
        this.router.navigate(["/minorView", a_C + 1, this.roboAdviceConfig.AssetClassLabel[a_C]]);
    }
}
