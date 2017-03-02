/**
 * Created by lorenzogagliani on 01/03/17.
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ManageJsonService {
  private path = '/app/';

  constructor (
    private http: Http
  ) { }

  getFromJson(fileJson: String): Observable<any> {
    return this.http.get(this.path + fileJson).map((res: Response) => res.json());
  }

}
