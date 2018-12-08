import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthState } from '../state/auth.reducer';
import { getAuthCurrentState } from '../state/auth.selectors';
import { AuthStates } from '../model/auth-states';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(getAuthCurrentState),
      map(authState => {
        if (authState === AuthStates.LOGGED_IN) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}
