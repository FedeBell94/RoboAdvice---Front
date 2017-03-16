/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { ApiService } from './remote-call.service';

import { GenericResponse } from './generic-response';

describe('Service: RemoteCall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService]
    });
  });

  it('#extract data must preserve data structure', ()=> {
    let srv = new ApiService(null);
    let genRes = [new GenericResponse(0, 0, "", ""),
                  new GenericResponse(0, 0, "", "W"),
                  new GenericResponse(0, 0, "W", ""),
                  new GenericResponse(0, 0, "W", "W"),
                  new GenericResponse(0, 1, "", ""),
                  new GenericResponse(0, 1, "", "W"),
                  new GenericResponse(0, 1, "W", ""),
                  new GenericResponse(0, 1, "W", "W"),
                  new GenericResponse(1, 0, "", ""),
                  new GenericResponse(1, 0, "", "W"),
                  new GenericResponse(1, 0, "W", ""),
                  new GenericResponse(1, 0, "W", "W"),
                  new GenericResponse(1, 1, "", ""),
                  new GenericResponse(1, 1, "", "W"),
                  new GenericResponse(1, 1, "W", ""),
                  new GenericResponse(1, 1, "W", "W")];
      
      for (let i = 0; i < genRes.length; i++) {
          let res = new Response(new ResponseOptions({ body: JSON.stringify(genRes[i]) }));
          expect(typeof srv['extractData'](res)).toEqual(typeof new GenericResponse());
      }
  });

  it('#handleError must return a string', ()=> {
    let srv = new ApiService(null);
    let genRes = [
        new Response(new ResponseOptions({ body: JSON.stringify({error: 400, message: "bad things"}) })),
        new Response(new ResponseOptions({ body: JSON.stringify({message: "bad things"}) })),
        new Response(new ResponseOptions({ body: JSON.stringify({}) })),
        new Response(new ResponseOptions({ body: JSON.stringify("error") }))
    ];
      
      for (let i = 0; i < genRes.length; i++) {
          expect(typeof srv['handleError'](genRes[i])).toEqual(typeof "");
      }
      expect(typeof srv['handleError']({"error": "bad things"})).toEqual(typeof "");
  });
});
