/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManageJsonService } from './manage-json.service';

describe('Service: ManageJson', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageJsonService]
    });
  });

  it('should ...', inject([ManageJsonService], (service: ManageJsonService) => {
    expect(service).toBeTruthy();
  }));
});
