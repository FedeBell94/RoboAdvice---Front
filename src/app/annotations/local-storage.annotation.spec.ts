/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorage } from './local-storage.annotation';

describe('Annotation: LocalStorage', () => {
  class MockClass {
        private counter: number = 0;
        @LocalStorage() testStorage: string;
        
        @LocalStorage() private _bar:string;
        get bar():string {
            return this._bar + this.counter;
        }
        set bar(theBar:string) {
            this._bar = theBar;
            this.counter++;
        }
  }
  

  beforeEach(() => {
    TestBed.configureTestingModule({
        
    });
  });
  
  it("#@LocalStorage must save data into localstorage with Class.property notation", ()=> {
    let mockInstance = new MockClass();
    mockInstance.testStorage = "pippo";
    mockInstance.bar = "false";
    expect(localStorage.getItem(mockInstance.constructor.name + ".testStorage")).toContain("pippo");
    expect(localStorage.getItem(mockInstance.constructor.name + "._bar")).toContain("false");
  });

  it("#@LocalStorage must initialize the property at first get", ()=> {
    let mockInstance = new MockClass();
    expect(mockInstance.testStorage).toBeTruthy();
    expect(mockInstance.bar).toBeTruthy();
  });

  it("#@LocalStorage must preserve getter and setter if present", ()=> {
    let mockInstance = new MockClass();
    expect(mockInstance['counter']).toEqual(0);
    mockInstance.bar = "test";
    expect(mockInstance['counter']).toEqual(1);
    
    mockInstance = new MockClass();
    expect(mockInstance.bar).toContain("test");
    expect(mockInstance.bar).toContain(mockInstance['counter']);
  });

  it("#@LocalStorage must delete localstorage item if new value is falsy", ()=> {
    let mockInstance = new MockClass();
    mockInstance.testStorage = "";
    mockInstance.bar = "";
    expect(localStorage.getItem(mockInstance.constructor.name + ".testStorage")).toBeNull();
    expect(localStorage.getItem(mockInstance.constructor.name + "._bar")).toBeNull();
  })
  
});
