import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { Router } from '@angular/router';

import {PortfolioService} from "../../../services/portfolio/portfolio.service";
import { AuthService } from "../../../services/remote/authentication.service";
import { DemoService } from "../../../services/demo/demo.service";

import { RoboAdviceConfig } from "../../../app.configuration";


declare var jQuery:any;

@Component({
    selector: 'topnavbar',
    templateUrl: 'topnavbar.template.html',
    styleUrls: ['topnavbar.style.css']
})
export class TopnavbarComponent {

    constructor(
        private portfolio: PortfolioService,
        private demo: DemoService,
        private auth: AuthService,
        private router: Router,
    ){}

    initialWorth: number = RoboAdviceConfig.DefaultInitialWorth;

    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    isDemo(): boolean {
        return this.router.url === "/demo";
    }

    getUsername(): any {
        if (this.auth.isLogged()) return this.auth.getUser().username;
        return false;
    }

    getWorth() {
        return this.portfolio.getCached("worth") || 10000;
    }

    getProfLoss() {
        return this.portfolio.getCached("profLoss") || 0;
    }

    getDemoWorth() {
        return this.demo.getCached("worth") || 10000;
    }

    getDemoProfLoss() {
        return this.demo.getCached("profLoss") || 0;
    }

}
