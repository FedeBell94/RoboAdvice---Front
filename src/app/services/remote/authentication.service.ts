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
        let headers = new Headers();
        headers.append("Authorization","Basic " + btoa(email + ":" + password));
        let opts = new RequestOptions({ headers: headers, withCredentials: true });

        return this.apis.post("loginUser", {}, opts).map((res)=>{
            if (res.response > 0) {
                //if i'm correctly logged, i'll set the default headerOptions for remote calls to pass the auth token on each request
                this.setAuthHeaders();
                this.setAuthToken(btoa(email + ":" + password));
                this.logInWithUser(res.data);
            }
            return res;
        });
    }


    register(email: string, nickname: string, password: string) {
        return this.apis.post("registerUser", {
            username: email,
            password: password,
            nickname: nickname
        });
    }

    private setCookie(cname:string, cvalue:string, exMins:number) {
        let d: Date = new Date();
        d.setTime(d.getTime() + (exMins*60*1000));
        let expires: string = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    private removeCookie(name: string){
        this.setCookie(name,'',-1);
    }

    logout() {
        this.apis.post("logoutUser", {}).subscribe(()=>{
            this.logged = false;
            this.setAuthToken("");
            this.removeCookie("authToken");
            this.removeCookie("JSESSIONID");
            this.router.navigate(["login"]);
        });
    }

    updateUsername(username: string) {
        return this.apis.post("updateUserUsername",  { username : username });
    }


    setAuthToken(userToken: string){
        document.cookie = "authToken=" + userToken + ";";
    }

    getAuthToken() {
        return this.estractCookie("authToken");
    }

    checkSession() {
        let headers = new Headers();
        headers.append("Authorization","Basic " + this.getAuthToken());
        let opts = new RequestOptions({ headers: headers, withCredentials: true });

        return this.apis.post("loginUser", {}, opts).map((res)=>{
            if (res.response > 0) {
                //if i'm correctly logged, i'll set the default headerOptions for remote calls to pass the auth token on each request
                this.setAuthHeaders();
                this.logInWithUser(res.data);
            }
            return res;
        });
    }

    saveUser(user: any) {
        this.currentUser = new User();
        this.currentUser.email = user.username;
        this.currentUser.id = user.id;
        this.currentUser.username = user.nickname;
    }

    private estractCookie(cookieName: string) {
        let value = "; " + document.cookie;
        let parts: any = value.split(";");
        for (let i = 0; i < parts.length; i++) {
            if (parts[i] && parts[i].split("=")[0].trim() == cookieName) return parts[i].split("=")[1] + "=";
        }
    }

    private setAuthHeaders() {
        let headers = new Headers;
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Credentials', 'true');
        //headers.append('User-Token', this.getAuthToken());
        let options = new RequestOptions({ headers: headers, withCredentials: true });
        this.apis.setDefaultRequestOptions(options);
    }

    private logInWithUser(user: any) {
        this.logged = true;
        //now i save the user
        this.saveUser(user);
        //if the user has a username
        //TODO: change navigate
        if (this.currentUser.username) this.router.navigate(["/mainView"]);
        else this.router.navigate(["/survey"]);
    }
}
