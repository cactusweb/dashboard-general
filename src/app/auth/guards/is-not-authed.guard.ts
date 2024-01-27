import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectIsAuthed } from '@csd-store/auth/auth.selectors';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { RouterPaths } from 'app/common/consts/router-paths.conts';
import { Observable, map, tap } from 'rxjs';

export function isAuthedGuard(): Observable<boolean> {
  const router = inject(Router);

  return inject(Store<State>)
    .select(selectIsAuthed)
    .pipe(
      map((authed) => authed),
      tap((allowed) => {
        if (!allowed) {
          router.navigate([RouterPaths.AUTH]);
        }
      })
    );
}
