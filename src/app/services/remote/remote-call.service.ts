import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    private apiUrl = 'http://localhost:8080/';  // URL to web API
    private restrictedPath = "api/";
    private callCount = 0;

    constructor ( private http: Http ) { }

    doLogin(action: string, pars: Object): Observable<any> {
        this.callCount++;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + action, pars, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    doLogout(action: string): Observable<any> {
        this.callCount++;
        return this.http.get(this.apiUrl + action)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    getData(action: string, pars: Object): Observable<any> {
        this.callCount++;
        return this.http.get(this.apiUrl + this.restrictedPath + action, pars)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    postData(action: string, pars: Object): Observable<any> {
        this.callCount++;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.apiUrl + this.restrictedPath + action, pars, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    putData(action: string, pars: Object): Observable<any> {
        this.callCount++;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.apiUrl + this.restrictedPath + action, pars, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    deleteData(action: string): Observable<any> {
        this.callCount++;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.delete(this.apiUrl + this.restrictedPath + action, options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private extractData(res: Response) {
        this.callCount--;
        let body = res.json();
        //console.log(body);
        if(body.status == "OK")
        return body.data || { };
        return body;
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
        return Observable.throw(errMsg);
    }
}