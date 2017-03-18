import { Component } from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services/remote/authentication.service";
import {PortfolioService} from "../../services/portfolio/portfolio.service";
import {AssetService} from "../../services/asset/asset.service";

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class loginComponent {

    constructor(
        private auth: AuthService,
        private router: Router,
        private portfolio: PortfolioService,
        private assetService: AssetService,
    ) {}

    doLogin(user:string, password:string) {
        this.auth.login(user, password).subscribe((data:any)=> {
            if (data.response > 0) {
                // just in case the user didn't navigate throw logout.
                this.portfolio.wipeCache();
                this.assetService.wipeCache();

                if (data.data.isNewUser == true){
                    this.router.navigate(["/survey"]);
                }else {
                    this.router.navigate(["/mainView"]);
                }
                (window as any).swal('Welcome ' + data.data.nickname, "","success");
            }else{
                (window as any).swal('Error', "Email or password wrong", "error");
            }
        });
    }
}
