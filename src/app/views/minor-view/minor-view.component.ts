import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { AssetService } from "../../services/asset/asset.service";

import { RoboAdviceConfig } from "../../app.configuration";

@Component({
    selector: 'minorView',
    templateUrl: 'minor-view.template.html',
    styleUrls: ['minor-view.style.css']
})
export class minorViewComponent {
    constructor(
        private route: ActivatedRoute,
        private asset: AssetService,
        private router: Router,
    ) { }
    private options: any;

    assetClassName: string;

    getOptions() {
        return this.options;
    }

    areaChartData(id: number) {
        this.asset.getAssetHistory(id).subscribe((data: any) => {
            console.log("areaChartData() --> cached data has arrived ", data.data);
            this.options = data.data;
        });
    };

    ngOnInit() {
        this.areaChartData(this.route.snapshot.params["assetClassId"] || 1);
        this.assetClassName = this.route.snapshot.params["assetClassName"] || RoboAdviceConfig.AssetClassLabel[0];
    }

    comeBack() {
        this.router.navigate(["/mainView"]);
    }

}
