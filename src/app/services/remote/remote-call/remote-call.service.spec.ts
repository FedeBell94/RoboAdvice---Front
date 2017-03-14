/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RemoteCallService } from './remote-call.service';

describe('Service: RemoteCall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemoteCallService]
    });
  });

  it('should ...', inject([RemoteCallService], (service: RemoteCallService) => {
    expect(service).toBeTruthy();
  }));
});
