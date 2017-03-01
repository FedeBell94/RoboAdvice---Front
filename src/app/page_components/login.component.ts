import { Component, OnInit } from "@angular/core";

import { AuthService } from "../services/remote/authentication.service";

@Component({
    selector: "login-page",
    templateUrl: "app/pages/login-page.template.html",
    styleUrls: ['app/css/login-signup-page.css']
})
export class LoginPageComponent {
    constructor(private auth: AuthService) {}

    doLogin(user:string, password:string) {
        console.log("trying to login with user=" + user + " and pwd=" + password);
        this.auth.login(user, password).catch((res)=>{
            console.log("not logged in " + res);
            return res;
        }).subscribe((data:any)=> {
            if (data.response > 0) {
                console.log("user logged: " + data.data.email);
                //print modal to user
                return;
            }
            //error on login
            console.log("error on login: " + data.errorString);
        });
    }
    
}
