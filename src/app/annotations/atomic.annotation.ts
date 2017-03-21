import { Observable } from "rxjs/Observable";

export function AtomicAsync(observableId?: number) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        let old = descriptor.value as Function;
        descriptor.value = function(...args: any[]): Observable<any> {
            let id: string;
            if (args.length > observableId) {
                id = args[observableId];    //making unique id for the call using the parameter passed
            } else {
                id = "pending";
            }
            let pending = this.constructor.prototype._pending;
            //checking integrity
            if (!pending)  {
                this.constructor.prototype._pending = {};
                pending = this.constructor.prototype._pending;
            }
            //if observable already exists
            if (pending[id]) {
                return pending[id].observable;
            }
            //else i have to create it
            pending[id] = new Obvable();
            pending[id].observable = Observable.create(observer=> {
                pending[id].observerList.push(observer);
                //if i'm not the first
                if (pending[id].observerList.length > 1) return;
                //else let's make the call
                old.apply(this, args).subscribe((data: any)=> {
                    //returning data to all observers
                    for (let i = 0; i < pending[id].observerList.length; i++) {
                        pending[id].observerList[i].next(data);
                        pending[id].observerList[i].complete();
                    }
                    pending[id].observerList = [];
                });
            });

            return pending[id].observable;
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