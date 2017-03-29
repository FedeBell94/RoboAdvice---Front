import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from "@angular/router";

declare var jQuery: any;

@Component({
    selector: 'app-portfolio-snapshot',
    templateUrl: './portfolio-snapshot.component.html',
    styleUrls: ['./portfolio-snapshot.component.css']
})
export class PortfolioSnapshotComponent implements OnInit {

    constructor(
        private router: Router,
    ) { }

    @Input() percentage: number;
    @Input() assetClassName: string;
    @Input() sellOrBuy: number = undefined;
    @Input() value: number;
    @Input() clickable: boolean = true;

    advice: string;

    ngOnInit() {
        if (this.sellOrBuy === undefined) {
            this.advice = "";
            return;
        }

        if (this.sellOrBuy > 0) {
            this.advice = "Buy";
        } else if (this.sellOrBuy < 0) {
            this.advice = "Sell";
        } else {
            this.advice = "Maintain";
        }
        jQuery('[data-toggle="tooltip"]').tooltip();
    }

    isLoss(percentage: number): boolean {
        return (percentage < 0);
    }

    needToBuy(sellBuy: number): boolean {
        return (sellBuy > 0);
    }

    isClickable(){
        return this.clickable;
    }

}
