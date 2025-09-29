import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { managerSecretaryGuard } from './manager-secretary.guard';

describe('managerSecretaryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => managerSecretaryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
