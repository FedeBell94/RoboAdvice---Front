import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RequestOptions, Headers } from '@angular/http';

import { ApiService } from './remote/remote-call.service';
import { AuthService } from './remote/authentication.service';

import { Strategy } from '../model/strategy/strategy';

@Injectable()
export class StrategyService {
    constructor(
        private apis: ApiService,
        private router: Router,
    ) { }
    getStrategy() {
        return this.apis.get("strategy");
    }
    saveStrategy(strategy: Strategy) {
        return this.apis.post("strategy", strategy.asset_class);
    }
}
