import { Observable } from "rxjs/Observable";
import { GenericResponse } from "../../services/remote/remote-call/generic-response";

export class Pending {
    constructor(){
        this.history = null;
        this.updateCache = null;
    }
    history: Observable<GenericResponse>;
    updateCache: Observable<GenericResponse>;
}