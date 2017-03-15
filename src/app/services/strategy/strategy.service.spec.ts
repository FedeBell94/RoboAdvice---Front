/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StrategyService } from './strategy.service';

describe('Service: Strategy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StrategyService]
    });
  });

  it('#StrategyService', () => {
    let service = new StrategyService(null);

    expect(service).toBeTruthy();
  });

});
