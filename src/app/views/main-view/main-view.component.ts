import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../services/remote/authentication.service";
import { PortfolioService } from "../../services/portfolio/portfolio.service";

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
        private portfolioService: PortfolioService,
    ) { }

    //Used into html to import configs.
    private roboAdviceConfig = RoboAdviceConfig;

    @ViewChild('strategyPieChart') pieChart: any;

    worthHistoryOptions: any;
    portfolio: any;

    getPortfolio(): Portfolio {
        return this.portfolio;
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

    isLogged(){
      return this.auth.isLogged();
    }

    showAsset(a_C: number) {
      this.router.navigate(["/minorView", a_C+1, this.roboAdviceConfig.AssetClassLabel[a_C]]);
    }
}
