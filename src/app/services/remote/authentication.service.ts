import { Injectable } from '@angular/core';
import { HttpInterceptorService } from 'ng-http-interceptor';

import { ApiService } from './remote-call.service';

@Injectable()
export class AuthService {
    constructor(
        private apis: ApiService
    ) { }

    login(user: string, password: string) {
        return this.apis.post("greeting", {}).map((res)=>{
            console.log("returnedermti");
        });
    }
}