import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select } from '@ngrx/store';
import { Observable, of, from } from "rxjs";
import { map, switchMap, catchError, tap, merge, pluck, mergeMap, concatMap,  } from 'rxjs/operators';

import { CognitoService, CognitoLoginInfo } from '../services/cognito.service';
import {
  LOGIN_USER,
  LOGOUT_USER,
  LoginUserAction,
  LoginUserSuccessAction,
  LoginUserErrorAction,
  
  LogoutUserAction,
  LogoutUserSuccessAction,
  LogoutUserErrorAction,
  SignupUserAction,
  SIGNUP_USER,
  SignupUserSuccessAction,
  SignupUserErrorAction,
} from '../actions/auth.actions';


@Injectable()
export class AuthorizationEffects {
    constructor(
      private actions: Actions,
      private cognitoService: CognitoService
    ){}

    @Effect()
    public loginUser: Observable<Action> = this.actions.ofType<LoginUserAction>(LOGIN_USER).pipe(
      switchMap(
        action => this.cognitoService.loginUser(action.payload.username, action.payload.password)
        .pipe(
          map(info => new LoginUserSuccessAction({
            user: info.cognitoUser,
            accessToken: info.accessToken,
            idToken: info.idToken
          })),
          catchError(err => of(new LoginUserErrorAction({error: err})))
        )
      )
    );
    
    @Effect()
    public logoutUser: Observable<Action> = this.actions.ofType<LogoutUserAction>(LOGOUT_USER).pipe(
      map(action => action.payload),
      map(payload => this.cognitoService.logoutUser(payload.user, payload.logoutGlobally)),
      map( _ => new LogoutUserSuccessAction()),
      catchError(error => of(new LogoutUserErrorAction(error)))
    );
    
    @Effect()
    public signupUser: Observable<Action> = this.actions.ofType<SignupUserAction>(SIGNUP_USER).pipe(
      map(action => action.payload.data),
      switchMap(
        data => this.cognitoService.signUpUser(data).pipe(
          map(user => new SignupUserSuccessAction({user: user})),
          catchError(err => of(new SignupUserErrorAction({error: err})))
        )
      )
    );
}