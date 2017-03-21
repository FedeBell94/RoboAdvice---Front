/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AssetService } from './asset.service';
import { GenericResponse } from "../remote/remote-call/generic-response";
import { ApiService } from "../remote/remote-call/remote-call.service";
import { Observable } from "rxjs/Observable";

describe('Service: Asset', () => {
  class ApiStub {
      public get(action: string, pars?: any) {
          return Observable.create(observer=> {
              setTimeout(()=> {
                  if (action == "assetClassHistory") {
                      observer.next(new GenericResponse(1, 0, "", [{date: "2017-01-01", value: 1234.1234}, {date: "2017-01-02", value: 1233.4313}]));
                  } else {
                      observer.next(new GenericResponse(1, 0, "", [{id: 1, name: "Bonds"}, {id: 2, name: "Forex"}, {id: 3, name: "Stock"}, {id: 4, name: "Commodities"}]));
                  }
                  observer.complete();
              }, 1);
          });
      }
  }

  let apis;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssetService,
        {provide: ApiService, useClass: ApiStub},
        ],
    });
    apis = TestBed.get(ApiService);
  });

  it('#wipeCache must reinitialize the cache', ()=> {
      let serv = new AssetService(null);
      serv.wipeCache(); 
      //assuring to have atleast some data before clearing
      serv['cache'].history.push("asd");
      expect(serv['cache'].history.length).toBeGreaterThan(0);
      serv.wipeCache();
      expect(serv['cache'].history.length).toEqual(0);

  });
  
  it('#computeCache sould elaborate the data and add something into cache', ()=> {
      let serv = new AssetService(null);
      serv.wipeCache();
      serv['cache'].raw[1] = [{date: "2012-01-01", value: 2402.2341}, {date: "2012-01-02", value: 2031.1234}];
      serv['computeCache'](1);
      expect(serv['cache'].raw).toBeTruthy();
      expect(serv['cache'].lastStoredDate[1]).toEqual("2012-01-02");
      expect(serv['cache'].history[1]).toBeTruthy();
  });


  it('#getAssetHistory must not crash', ()=> {
    let serv = new AssetService(apis);
    serv.wipeCache();
    for (let i = 0; i < 10; i++) {
        serv.getAssetHistory(1).subscribe((data)=> {
            expect(data.response).toBeGreaterThan(0);
        });
    }
    serv.wipeCache();
  });

  it('#getAssets must not crash', ()=> {
    let serv = new AssetService(apis);
    serv.wipeCache();
    for (let i = 0; i < 10; i++) {
        serv.getAssets().subscribe((data)=> {
            expect(data.response).toBeGreaterThan(0);
        });
    }
    serv.wipeCache();
  });
});
