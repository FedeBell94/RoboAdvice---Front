import { Injectable } from '@angular/core';
import { ApiService } from '../remote/remote-call/remote-call.service';
import { Strategy } from '../../model/strategy/strategy';

@Injectable()
export class StrategyService {
    constructor(
        private apis: ApiService,
    ) { }
    getStrategy() {
        return this.apis.get('strategy');
    }
    saveStrategy(strategy: Strategy) {
        return this.apis.post('strategy', strategy.asset_class);
    }
}
