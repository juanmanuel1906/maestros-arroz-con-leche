import { TestBed } from '@angular/core/testing';

import { DeviceIdService } from './device-id';

describe('DeviceId', () => {
  let service: DeviceIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
