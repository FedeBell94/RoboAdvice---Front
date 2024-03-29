/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http } from '@angular/http'
import { AuthService } from './authentication.service';
import { ApiService } from './remote-call/remote-call.service';

import { User } from '../../model/user/user';

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

  it('#saveUser should instantiate a new User', ()=>{
    auth = new AuthService(new ApiService(null), null);
    let oldUser = auth.getUser();
    expect(oldUser).toBeNull();
    
    // server return such type of object
    let newUser = {
      username: 'a@a.com',
      isNewUser: false,
      id: 1,
      nickname: 'Pippo'
    }

    auth.saveUser(newUser);

    let savedUser = auth.getUser();
    expect(savedUser.email).toContain('a@a.com');
    expect(savedUser.id).toBeDefined();
    expect(savedUser.isNewUser).toBeDefined();
    expect(savedUser.username).toContain('Pippo');

    newUser = {
      username: 'ab@a.com',
      isNewUser: false,
      id: 1,
      nickname: 'Pippoasd'
    }

    auth.saveUser(newUser);

    savedUser = auth.getUser();
    expect(savedUser.email).toContain('ab@a.com');
    expect(savedUser.id).toBeDefined();
    expect(savedUser.isNewUser).toBeDefined();
    expect(savedUser.username).toContain('Pippoasd');
  });

  it('#extractCookie should load the cookie if it exists', ()=> {
      auth = new AuthService(null, null);
      let token = auth['estractCookie']('authToken');

      if (document.cookie.indexOf('authToken') !== -1) {
        expect(token).toBeTruthy();
        expect(token.length).toBeGreaterThan(0);
      } else {
        expect(token).toBeFalsy();
      }
  });

  it('#removeCookie must call setCookie', ()=> {
      auth = new AuthService(null, null);
      let spied = spyOn(auth, 'removeCookie').and.callThrough();
      auth['removeCookie']("authToken");
      expect(spied).toHaveBeenCalled();
      expect(auth['removeCookie']).toHaveBeenCalled();
  });

  it('#setAuthHeaders must call apis.setDefaultRequestOptions', ()=> {
      let apis = new ApiService(null);
      let auth = new AuthService(apis, null);

      let authSpy = spyOn(auth, 'setAuthHeaders').and.callThrough();
      let spied = spyOn(apis, 'setDefaultRequestOptions');

      auth['setAuthHeaders']();
      
      expect(apis.setDefaultRequestOptions).toHaveBeenCalled();
  });

  it('#isLogged must return a boolean', ()=> {
      let auth = new AuthService(null, null);

      expect(auth['isLogged']()).toBeDefined('field \'isLogged\' has to be initialized');
  })

  it('#setAuthToken must set the token while #getAuthToken must return it', ()=> {
      let auth = new AuthService(null, null);

      auth['removeCookie']("authToken");
      let tok = auth.getAuthToken();
      expect(tok).toBeFalsy();

      auth.setAuthToken(btoa("a@a.com:a"));
      tok = auth.getAuthToken();
      expect(tok).toContain(btoa("a@a.com:a"));
  });

});
