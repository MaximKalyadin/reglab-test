import { TestBed } from '@angular/core/testing';

import { MainStoreService } from './main-store.service';

describe('MainStoreService', () => {
  let service: MainStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
