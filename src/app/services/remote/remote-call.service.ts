import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    private apiUrl = 'http://localhost:8080/';  // URL to web API
    private callCount = 0;

    constructor ( 
            private http: Http,
            private interceptor: HttpInterceptorService,
        ) {
            interceptor.request().addInterceptor((req: any, method: string) => {
                console.log( new Date().toDateString() + " - INTERCEPTED REQUEST: " + req);
                return req;
            }); 
            interceptor.response().addInterceptor((res: any, method: string)=> {
                this.callCount--;
                res.subscribe((data: any)=>{
                    console.log( new Date().toDateString() + " - INTERCEPTED RESPONSE: " + data);
                });
                return res;
            });
        }

    get(action: string, params: Object): Observable<any> {
        let reqAction = action + "?";
        for (let p in params) reqAction = reqAction + p + "=" + params[p] + "&";
        reqAction = reqAction.substr(0, reqAction.length - 1);
        console.log("requesting to: " + reqAction);
        return this.http.get(this.apiUrl + reqAction).map(this.extractData).catch(this.handleError);
    }

    post(action: string, params: Object): Observable<any> {
        let headers = new Headers();
        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + action, params, options).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        this.callCount--;
        let body = res.json();
        //console.log(body)
        return res || { };
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