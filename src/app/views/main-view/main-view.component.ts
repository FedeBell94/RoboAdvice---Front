import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services/remote/authentication.service";
import {StrategyService} from "../../services/strategy.service";
import {PortfolioService} from "../../services/portfolio.service";

import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html',
    styleUrls: ['main-view.style.css']
})
export class mainViewComponent implements OnInit{
    constructor(
        private auth: AuthService,
        private router: Router,
        private strategyService: StrategyService,
        private portfolio: PortfolioService,
    ){ }

    @ViewChild('strategyPieChart') pieChart: any;

    private strategyValues: number[] = [25, 25, 25, 25];

    worthHistoryOptions: any;

    ngOnInit(){
        if (!this.auth.isLogged()) {
            this.router.navigate(["login"]);
            return;
        }
        if (this.auth.getUser().newUser){
            //TODO go to the survey
            //this.router.navigate(["survey"]);
        }else{
            //TODO go to the mainView, so here
            //this.router.navigate(["mainView"]);
            this.strategyService.getStrategy().subscribe((data)=>{
                let i: number = 0;
                for (let assetClass of data.data) {
                    this.strategyValues[i] = assetClass.percentage;
                    i++;
                }
                console.log(this.strategyValues);
            });
            this.portfolio.getWorthHistoryOptions().subscribe((data)=> {
                if (data.response > 0) {
                    this.worthHistoryOptions = data.data;
                }
            });
        }
    }

    getMyStrategy(){
      return this.strategyValues;
    }

    getPortfolio() {
        return this.portfolio.getLastPortfolio();
    }

    isLoss(percentage: number): boolean{
        if (percentage < 0)
            return true;
        else
            return false;
    }

    showAsset(a_C: number){
      this.router.navigate(["/minorView", a_C]);
    }
}
