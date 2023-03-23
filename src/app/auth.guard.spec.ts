/**
 * Title: auth.guard.spec.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/26/23
 * Description: ts for the nodebucket project
*/

import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
