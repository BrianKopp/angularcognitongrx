import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CognitoService } from '../services/cognito.service';
import { LOGIN_USER_SUCCESS, LoginUserSuccessAction } from "../actions/auth.actions";
import { Router } from "@angular/router";
import { tap, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Action } from "@ngrx/store";

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
}