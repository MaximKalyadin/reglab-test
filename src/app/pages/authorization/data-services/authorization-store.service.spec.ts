import { TestBed } from '@angular/core/testing';

import { AuthorizationStoreService } from './authorization-store.service';

describe('AuthorizationStoreService', () => {
  let service: AuthorizationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
