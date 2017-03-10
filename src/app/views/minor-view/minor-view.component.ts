import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";



import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";
import {PortfolioService} from "../../services/portfolio.service";


@Component({
    selector: 'minorView',
    templateUrl: 'minor-view.template.html'
})
export class minorViewComponent {
  constructor(

    private portfolio: PortfolioService,
  ){ }


  areaChartData() {
    return this.portfolio.getCachedPortfolioHistoryChartOptions();
  };



}
