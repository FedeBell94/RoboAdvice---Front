import { Component } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';

import {PortfolioService} from "../../../services/portfolio.service";
import {AuthService} from "../../../services/remote/authentication.service";


declare var jQuery:any;

@Component({
    selector: 'topnavbar',
    templateUrl: 'topnavbar.template.html',
    styleUrls: ['topnavbar.style.css']
})
export class TopnavbarComponent {

    constructor(
        private portfolio: PortfolioService,
        private auth: AuthService,
    ){}

    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    getUsername(): any {
        if (this.auth.isLogged()) return this.auth.getUser().username;
        return false;
    }

    getWorth() {
        return this.portfolio.getWorth();
    }

    getProfLoss() {
        return this.portfolio.getProfLoss();
    }

}
