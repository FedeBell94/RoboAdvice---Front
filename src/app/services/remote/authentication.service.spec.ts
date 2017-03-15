/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './authentication.service';
import { ApiService } from './remote-call/remote-call.service';

describe('Service: Authentication', () => {
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
  });

  it('#AuthService should inject', ()=>{
      auth = new AuthService(new ApiService(null), null);
      expect(auth).toBeTruthy();
  });
});
