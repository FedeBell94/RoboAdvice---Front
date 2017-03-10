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

    strategyValues: number[];

    areaChartData() {
        return this.portfolio.getCachedPortfolioHistoryChartOptions();
    };

    ngOnInit(){
        if (!this.auth.isLogged()) {
            this.router.navigate(["login"]);
            return;
        } else {
            if (this.auth.isUserNew()){
              //TODO go to the survey
              //this.router.navigate(["survey"]);
            }else{
              //TODO go to the mainView
              //this.router.navigate(["mainView"]);
            }
        }
        this.strategyService.getStrategy().subscribe((data)=> {
            console.log("strategy has arrived: " + JSON.stringify(data.data));
            if (data.response > 0) {
                this.strategyValues = data.data.map((el: any)=>{ return el.percentage; });
                this.strategyValues.push(0);
                this.pieChart.rePaint();
            }
        });
    }

    saveStrategy(event: any) {
        //called on 'save' event emitted from pie-chart on 'Save' button
        //output is: [25, 25, 25, 25], in the same order of value passed

        if (event[4] == 0) {  //Check if the 'empty' portion is 0%
            event.pop();
            let str: Strategy = new Strategy();
            for (let i = 0; i < event.length; i++) {
                let asset = new Asset();
                asset.assetClassId = i + 1; //server has 1-based ids
                asset.percentage = event[i];
                str.asset_class.push(asset);
            }
            str.name = "Custom";
            this.strategyService.saveStrategy(str).subscribe((data) => {
                alert("Stratgy changed");
                //TODO: modal
                console.log("Strategy saved");
                event.push(0);
            });
        }else{
            //TODO: modal: something went wrong
            alert("something went wrong");
        }
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

    showAsset(){

      this.router.navigate(["minorView"]);
    }
}
