import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/auth.selectors';
import { map } from 'rxjs';

export const secretaryGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectUser).pipe(
    map((user: any) => {
      if (user.role !== 'Secretary') {
        router.navigate(['/']); // redirect if not manager
        return false;
      }
      return true;
    })
  );
};
