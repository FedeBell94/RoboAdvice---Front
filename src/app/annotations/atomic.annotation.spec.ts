/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AtomicAsync } from './atomic.annotation';
import { Observable } from "rxjs/Observable";

describe('Annotation: LocalStorage', () => {
    class MockClass {
        private getdataasyncCounter = 0;
        private getdataasyncwithparamsCounter = 0;
        private getdataasyncwithbadparamsCounter = 0;
        @AtomicAsync()
        public getDataAsync() {
            this.getdataasyncCounter++;
            return Observable.create(observer => {
                setTimeout(() => {
                    observer.next("pippo");
                    observer.complete();
                }, 1);
            });
        }
        @AtomicAsync(0)
        public getDataAsyncWithParams(pippo: string) {
            this.getdataasyncwithparamsCounter++;
            return Observable.create(observer => {
                setTimeout(() => {
                    observer.next(pippo);
                    observer.complete();
                }, 1);
            });
        }
        @AtomicAsync(2)
        public getDataAsyncWithBadParams(s: string) {
            this.getdataasyncwithbadparamsCounter++;
            return Observable.create(observer => {
                setTimeout(() => {
                    observer.next(s);
                    observer.complete();
                }, 1);
            });
        }
    }


    beforeEach(() => {
        TestBed.configureTestingModule({

        });

    });

    it('#@AtomicAsync must call the function just once, even if called multiple times', async(() => {
        let mock = new MockClass();
        for (let i = 0; i < 5; i++) {
            mock.getDataAsync().subscribe(data => {
                expect(data).toContain("pippo");
                expect(mock['getdataasyncCounter']).toBeLessThan(2);
            });
        }
        for (let i = 0; i < 5; i++) {
            mock.getDataAsyncWithParams("asdasd").subscribe(data => {
                expect(data).toContain("asdasd");
                expect(mock['getdataasyncwithparamsCounter']).toBeLessThan(2);
            });
        }
        for (let i = 0; i < 5; i++) {
            mock.getDataAsyncWithBadParams("qwe").subscribe(data => {
                //due to the fact that we provided a bad id, the default is used. this cause the @AtomicAsync() to provide the same observable created for getDataAsync, 
                //that had no id provided too but is called before. so we're expecting the same output of the getDataAsync() function.
                expect(data).toContain("pippo");    
                expect(mock['getdataasyncwithbadparamsCounter']).toBeLessThan(2);
            });
        }
    }));

});
