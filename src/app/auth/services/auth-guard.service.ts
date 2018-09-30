import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { take, map } from "rxjs/operators";

import * as fromAuth from '../reducers/auth.reducer';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuth.State>, private router: Router) {}
  
  canActivate(): Observable<boolean> {
    return this.store.pipe(
      select(fromAuth.isAuthenticated),
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }),
      take(1)
    );
  }
}