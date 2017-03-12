import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../services/remote/authentication.service";
import { StrategyService } from "../../services/strategy.service";
import { PortfolioService } from "../../services/portfolio.service";

import { Strategy } from "../../model/strategy/strategy";
import { Asset } from "../../model/strategy/asset";

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

    @ViewChild('strategyPieChart') pieChart: any;

    private strategyValues: number[] = [25, 25, 25, 25];

    worthHistoryOptions: any;
    portfolio: any;

    getPortfolio() {
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
                for (let assetClass of data.data) {
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
        this.portfolioService.getPortfolio().subscribe(data=>{
            if (data.response > 0) {
                this.portfolio = data.data;
            }
        });
    }

    getMyStrategy() {
        return this.strategyValues;
    }

    isLoss(percentage: number): boolean {
        if (percentage < 0)
            return true;
        else
            return false;
    }

    showAsset(a_C: number) {
        let name: string;
        switch (a_C){
          case 1:  name = "Bonds"; break;
          case 2:  name = "Forex"; break;
          case 3:  name = "Stocks"; break;
          case 4:  name = "Commodities"; break;

        }
        this.router.navigate(["/minorView", a_C, name]);
    }
}
