import { TestBed } from '@angular/core/testing';

import { AuthorizationClientService } from './authorization-client.service';

describe('AuthorizationClientService', () => {
  let service: AuthorizationClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
