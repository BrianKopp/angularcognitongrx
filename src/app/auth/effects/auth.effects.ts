import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from "rxjs/operators";

import { LOGIN_USER_SUCCESS, CONFIRMED_REQUIRE_LOGIN_ACTION } from "../actions/auth.actions";
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class AuthorizationEffects {
    constructor(
      private actions: Actions,
      private cognitoService: CognitoService,
      private router: Router
    ) { }

    @Effect({dispatch: false})
    loginSuccess$ = this.actions.pipe(
      ofType(LOGIN_USER_SUCCESS),
      tap(_ => this.router.navigate(['/']))
    );

    @Effect({dispatch: false})
    confirmedRequireLoginRedirectEffect = this.actions.pipe(
      ofType(CONFIRMED_REQUIRE_LOGIN_ACTION),
      tap(_ => this.router.navigate(['/login']))
    );
}