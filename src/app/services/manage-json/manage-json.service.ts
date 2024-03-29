import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ManageJsonService {
  private path = '/assets/';

  constructor (
    private http: Http
  ) { }

  getFromJson(fileJson: string): Observable<any> {
    return this.http.get(this.path + fileJson).map(
      (res: Response) => res.json()
      );
  }

}
