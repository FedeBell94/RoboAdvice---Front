import { Component } from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services/remote/authentication.service";
import {PortfolioService} from "../../services/portfolio.service";

@Component({
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class loginComponent {

    constructor(
        private auth: AuthService,
        private portfolio: PortfolioService,
        private router: Router,
    ) {}

    doLogin(user:string, password:string) {
        this.auth.login(user, password).catch((res)=>{
            return res;
        }).subscribe((data:any)=> {
            if (data.response > 0) {
                this.portfolio.forceDownolad().subscribe((data)=>{
                    this.router.navigate(["/mainView"]);
                    //TODO: modal: welcome user
                });
            }

            //error on login
            console.log("error on login: " + data.errorString);
        });
    }
}