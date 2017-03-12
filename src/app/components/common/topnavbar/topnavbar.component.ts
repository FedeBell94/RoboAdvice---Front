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

    private worth: number;
    private profLoss: number;

    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    ngOnInit() {
        this.portfolio.getWorth().subscribe((data)=> {
            if (data.response > 0) {
                this.worth = data.data;
            }
        });
        this.portfolio.getProfLoss().subscribe((data)=> {
            if (data.response > 0) {
                this.profLoss = data.data;
            }
        });
    }

    getUsername(): any {
        if (this.auth.isLogged()) return this.auth.getUser().username;
        return false;
    }

    getWorth() {
        return this.worth;
    }

    getProfLoss() {
        return this.profLoss;
    }

}
