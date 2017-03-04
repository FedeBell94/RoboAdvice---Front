import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';

import { ApiService } from './remote-call.service';

import { User } from '../../model/user/user';

@Injectable()
export class AuthService {
    constructor(
        private apis: ApiService,
        private router: Router,
    ) { }
    private logged:boolean = false;
    private currentUser:User = null;

    isLogged() {
        return this.logged;
    }

    getUser() {
        return this.currentUser;
    }

    login(email: string, password: string) {
        return this.apis.post("loginUser", {
            email: email,
            password: password
        }).map((res)=>{
            if (res.response > 0) {
                this.setAuthToken(res.data.userToken);
                this.logged = true;
                //if i'm correctly logged, i'll set the default headerOptions for remote calls to pass the auth token on each request
                let headers = new Headers;
                headers.append('Accept', 'application/json');
                headers.append('Content-Type', 'application/json');
                headers.append('Access-Control-Allow-Credentials', 'true');
                headers.append('User-Token', this.getAuthToken());
                let options = new RequestOptions({ headers: headers });
                this.apis.setDefaultRequestOptions(options);
                //now i save the user
                this.currentUser = new User();
                this.currentUser.email = res.data.user.email;
                this.currentUser.id = res.data.user.id;
                this.currentUser.username = res.data.user.username;
                //if the user has a username
                if (this.currentUser.username) this.router.navigate(["/dashboard"]);
                else this.router.navigate(["/survey"]);
            }
            return res;
        });
    }
    

    register(email: string, password: string) {
        return this.apis.post("registerUser", {
            email: email,
            password: password
        }).share();
    }

    logout() {
        this.logged = false;
        this.router.navigate(["login"]);
        //da chiamare l'API giusta
    }


    setAuthToken(userToken: string){
        document.cookie = "authToken=" + userToken + ";";
    }

    getAuthToken() {
        return this.estractCookie("authToken")
    }

    private estractCookie(cookieName: string) {
        let value = "; " + document.cookie;
        let parts: any = value.split(";");
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] && parts[i].split("=")[0].trim() == cookieName) return parts[i].split("=")[1];
        }
    }
}
