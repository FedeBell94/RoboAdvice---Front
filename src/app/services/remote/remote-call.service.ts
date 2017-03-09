import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    //private apiUrl = 'http://localhost:8080/';  // URL to web API
    private apiUrl = 'http://192.168.2.116:8080/securedApi/';
    private callCount = 0;

    constructor (
            private http: Http,
            private router: Router,
        ) {
            /*interceptor.request().addInterceptor((req: any, method: string) => {
                //console.log( new Date().toDateString() + " - INTERCEPTED REQUEST: " + req);
                return req;
            });
            interceptor.response().addInterceptor((res: any, method: string)=> {
                this.callCount--;
                res.share().subscribe((data: any)=>{
                    //console.log( new Date().toDateString() + " - INTERCEPTED RESPONSE: " + data);
                });
                return res;
            });*/
        }

    private defaultOptions: RequestOptions;
    setDefaultRequestOptions(options: RequestOptions) {
        this.defaultOptions = options;
    }

    get(action: string, params?: Object, options?: RequestOptions): Observable<any> {
        let reqAction = action;
        if (params) {
            reqAction += "?";
            for (let p in params) reqAction = reqAction + p + "=" + params[p] + "&";
            reqAction = reqAction.substr(0, reqAction.length - 1);
        }
        if (options) return this.http.get(this.apiUrl + reqAction, options).map(this.extractData).catch(this.handleError);
        if (this.defaultOptions) return this.http.get(this.apiUrl + reqAction, this.defaultOptions).map(this.extractData).catch(this.handleError);
        return this.http.get(this.apiUrl + reqAction).map(this.extractData).catch(this.handleError);
    }

    post(action: string, params: any, options?: RequestOptions): Observable<any> {
        let headers: Headers;
        if (!options && !this.defaultOptions) {
            headers = new Headers();
            headers.append('Accept', 'application/json');
            headers.append('Content-Type', 'application/json');
        }
        let opts = options || this.defaultOptions || new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + action, params, opts).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        /// {   response: 0 (errore) | 1+ (ok),
        ///     errorCode: (intero univoco),
        ///     errorString: (string di messaggio dell'errore),
        ///     data: (dati se non errori) }
        let body = res.json();
        console.log(body);
        if (body.response == 0) {
            //error there
            console.log( new Date().toDateString() + " SERVER API ERROR " + body.errorCode + ": " + body.errorString);
            switch(body.errorCode) {
                case 999:
                    //auth error
                    //TODO: display a message to the user
                    //this.router.navigate(["login"]);
                    break;
            }
        }
        return body || { };
    }

    private handleError (error: Response | any) {
        this.callCount--;
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return errMsg;
    }
}
