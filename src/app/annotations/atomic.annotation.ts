import { Observable } from "rxjs/Observable";

export function AtomicAsync(observableId: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        let old = descriptor.value as Function;
        descriptor.value = function(...args: any[]): Observable<any> {
            let pending = this.constructor.prototype._pending;
            //checking integrity
            if (!pending)  {
                this.constructor.prototype._pending = {};
                pending = this.constructor.prototype._pending;
            }
            //if observable already exists
            if (pending[observableId]) {
                return pending[observableId].observable;
            }
            //else i have to create it
            pending[observableId] = new Obvable();
            pending[observableId].observable = Observable.create(observer=> {
                pending[observableId].observerList.push(observer);
                //if i'm the first
                if (pending[observableId].observerList.length > 1) return;
                //else let's make the call
                old.apply(this, args).subscribe((data: any)=> {
                    //returning data to all observers
                    for (let i = 0; i < pending[observableId].observerList.length; i++) {
                        pending[observableId].observerList[i].next(data);
                        pending[observableId].observerList[i].complete();
                    }
                    pending[observableId].observerList = [];
                });
            });

            return pending[observableId].observable;
        }
    }
}

class Obvable {
    constructor() {
        this.observerList = [];
    }
    public observable: Observable<any>;
    public observerList: any[];
}