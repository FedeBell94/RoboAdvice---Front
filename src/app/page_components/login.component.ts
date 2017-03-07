import { Component, OnInit } from "@angular/core";

import {DialogsService} from "../modals/modalservices/dialog.services";
import { AuthService } from "../services/remote/authentication.service";
import { PortfolioService } from "../services/portfolio.service";

@Component({
    selector: "login-page",
    templateUrl: "app/pages/login-page.template.html",
    styleUrls: ['app/css/login-signup-page.css']
})
export class LoginPageComponent {


  constructor(private auth: AuthService,
              private dialogsService: DialogsService,
              private portfolio: PortfolioService,

  ) {}

    doLogin(user:string, password:string) {
        this.auth.login(user, password).catch((res)=>{
            return res;
        }).share().subscribe((data:any)=> {
            if (data.response > 0) {
                this.portfolio.forceDownolad().share().subscribe((data)=>{
                    this.dialogsService.success('Welcome', user);
          
                });
            }

            //error on login
            console.log("error on login: " + data.errorString);
        });
    }

}
