import { Component, OnInit } from '@angular/core';
import { correctHeight, detectBody } from './app.helpers';
import { Router } from "@angular/router";

import { AuthService } from "./services/remote/authentication.service";
import { RoboAdviceConfig } from "./app.configuration";
import { LocalStorage } from "./annotations/local-storage.annotation";
import { PortfolioService } from "./services/portfolio/portfolio.service";
import { AssetService } from "./services/asset/asset.service";
import { NeuralNetworkService } from "./services/forecasting/neural-network.service";

declare var jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
        private portfolio: PortfolioService,
        private asset: AssetService,
        private neural: NeuralNetworkService,
    ) { }
    @LocalStorage() private cachedVersion: string;
    private roboConfig = RoboAdviceConfig;

    ngAfterViewInit() {
        // Run correctHeight function on load and resize window event
        jQuery(window).bind("load resize", function () {
            correctHeight();
            detectBody();
        });

        // Correct height of wrapper after metisMenu animation.
        jQuery('.metismenu a').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }

    ngOnInit() {
        //checking build version to check if we need to clear the cache
        if (this.cachedVersion && this.cachedVersion != this.roboConfig.Build) {
            this.portfolio.wipeCache();
            this.asset.wipeCache();
            this.neural.wipeCache();
        }
        //saving current version
        this.cachedVersion = this.roboConfig.Build;

        this.auth.checkSession().subscribe((data) => {
            if (data.response > 0) {
                this.router.navigate(["/mainView"]);
            } else {
                this.router.navigate(["/login"]);
            }
        });
    }

    isLogged() {
        return this.auth.isLogged();
    }

    getUsername(): any {
        if (this.auth.isLogged()) return this.auth.getUser().username;
        return false;
    }

}
