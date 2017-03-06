import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';
import { StrategyService } from '../services/strategy.service';
import { PortfolioService } from '../services/portfolio.service';

import { PieChartComponent } from '../components/pie-chart.component';

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
  ) { }
  @ViewChild('strategyPieChart') pieChart: any;

  strategyValues:number[];
  areaChartData: any;

  ngOnInit() {
    if (!this.auth.isLogged()) {
      this.router.navigate(["login"]);
      return;
    } else {
      //TODO: if (this.auth.getUser().username == null) this.router.navigate(["survey"]); return;
    }
    this.strategyService.getStrategy().share().subscribe((data)=> {
      console.log("strategy has arrived: " + JSON.stringify(data.data));
      if (data.response > 0) {
        this.strategyValues = data.data.map((el: any)=>{ return el.percentage; });
        this.strategyValues.push(0);
        this.pieChart.rePaint();
      }
    });

    this.areaChartData = this.portfolio.getHistory();
  }

  saveStrategy(event: any) {
      //called on 'save' event emitted from pie-chart on 'Save' button
      //output is: [25, 25, 25, 25], in the same order of value passed

      if (event[4] == 0) {  //Check if the 'empty' portion is 0%
          event.splice(event.length);
          let str: Strategy = new Strategy();
          for (let i = 0; i < event.length; i++) {
            let asset = new Asset();
            asset.assetClassId = i + 1; //server has 1-based ids
            asset.percentage = event[i];
            str.asset_class.push(asset);
          }
          str.name = "Custom";
          this.strategyService.saveStrategy(str).share().subscribe((data) => {
            //TODO: tell the user all is ok with a modal


            event.push(0);
          });
      }else{
            //TODO: tell the user that must be complete all the percentage
      }
  }
}
