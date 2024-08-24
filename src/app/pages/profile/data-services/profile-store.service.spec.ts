import { TestBed } from '@angular/core/testing';

import { ProfileStoreService } from './profile-store.service';

describe('ProfileStoreService', () => {
  let service: ProfileStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
