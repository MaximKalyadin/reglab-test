import { TestBed } from '@angular/core/testing';

import { MainClientService } from './main-client.service';

describe('MainClientService', () => {
  let service: MainClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
