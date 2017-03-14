import { Component } from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from "../../services/remote/authentication.service";
import {PortfolioService} from "../../services/portfolio/portfolio.service";

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
        this.auth.login(user, password).subscribe((data:any)=> {
            if (data.response > 0) {
              console.log(data.data.newUser);
                if (data.data.newUser == true){
                    this.router.navigate(["/survey"]);
                }else {
                    this.router.navigate(["/mainView"]);
                }
                (window as any).swal('Welcome ' + data.data.nickname, "","success");
            }else{
                (window as any).swal('Error', "Email or password wrong", "error");
            }

            //error on login
            console.log("error on login: " + data.errorString);
        });
    }
}
