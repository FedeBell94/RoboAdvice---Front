import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";



import {Strategy} from "../../model/strategy/strategy";
import {Asset} from "../../model/strategy/asset";
import {AssetService} from "../../services/asset/asset.service";


@Component({
    selector: 'minorView',
    templateUrl: 'minor-view.template.html'
})
export class minorViewComponent {
  constructor(
    private route: ActivatedRoute,
    private asset: AssetService,
  ){ }
  private options: any;

  assetClassName: string;

  getOptions() {
    return this.options;
  }

  areaChartData(id: number) {
    this.asset.getAssetHistory(id).subscribe((data: any)=> {
      console.log("cached data has arrived:", data.data);
      this.options = data.data;
    });
  };

  ngOnInit() {
    this.areaChartData(this.route.snapshot.params["assetClassId"] || 1);
    this.assetClassName = this.route.snapshot.params["assetClassName"] || "Bonds";
  }

}
