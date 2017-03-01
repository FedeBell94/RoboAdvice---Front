import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptorService } from 'ng-http-interceptor';

import { ApiService } from './remote-call.service';

@Injectable()
export class AuthService {
    constructor(
        private apis: ApiService,
        private router: Router,
    ) { }
    private logged:boolean = false;

    isLogged() {
        return this.logged;
    }

    login(email: string, password: string) {
        return this.apis.post("loginUser", {
            email: email,
            password: password
        }).map((res)=>{
            if (res.response > 0) {
                this.logged = true;
                this.router.navigate(["/dashboard"]);
            }
            return res;
        });
    }

    register(email: string, password: string) {
        return this.apis.post("registerUser", {
            email: email,
            password: password
        });
    }

    logout() {
        this.logged = false;
        this.router.navigate(["login"]);
        //da chiamare l'API giusta
    }
}