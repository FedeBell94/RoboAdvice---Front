/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PortfolioService } from './portfolio.service';

describe('Service: AssetSnapshot', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioService]
    });
  });

  it('should ...', inject([PortfolioService], (service: PortfolioService) => {
    expect(service).toBeTruthy();
  }));
});