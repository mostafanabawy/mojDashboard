import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectUser } from '../store/auth.selectors';

export const managerSecretaryGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectUser).pipe(
    map((user: any) => {
      if (!['Manager', 'Secretary'].includes(user.role)) {
        router.navigate(['/']); // redirect if not manager
        return false;
      }
      return true;
    })
  );
};
