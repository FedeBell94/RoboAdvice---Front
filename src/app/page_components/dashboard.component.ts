import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';
import { StrategyService } from '../services/strategy.service';
import { PortfolioService } from '../services/portfolio.service';
import {DialogsService} from "../modals/modalservices/dialog.services";


import { Strategy } from '../model/strategy/strategy';
import { Asset } from '../model/strategy/asset';

@Component({
  selector: "dashboard-page",
  templateUrl: "app/pages/dashboard-page.template.html",
  styleUrls: ['app/css/dashboard-page.css']
})
export class DashboardPageComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private strategyService: StrategyService,
    private portfolio: PortfolioService,
    private dialogsService: DialogsService
  ) { }
  @ViewChild('strategyPieChart') pieChart: any;

  strategyValues: number[];
  areaChartData() {
    return this.portfolio.getCachedPortfolioHistoryChartOptions();
  };

  ngOnInit() {
    if (!this.auth.isLogged()) {
      this.router.navigate(["login"]);
      return;
    } else {
      if (this.auth.getUser().username == null) {
        this.router.navigate(["survey"]);
      }
    }
    this.strategyService.getStrategy().share().subscribe((data)=> {
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
          this.strategyService.saveStrategy(str).share().subscribe((data) => {
           this.dialogsService.confirm('You have changed your strategy','')
            console.log("Strategy saved");

            event.push(0);
          });
      }else{
            this.dialogsService.error('Somenthing went wrong','Try again later');
      }
  }
}
