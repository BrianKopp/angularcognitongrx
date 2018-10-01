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
      ),
      // map(action => action.payload),
      // mergeMap(credentials => this.cognitoService.loginUser(credentials.username, credentials.password)),
      // map(info => new LoginUserSuccessAction({user: info.cognitoUser, accessToken: info.accessToken, idToken: info.idToken})),
      // catchError(err => new LoginUserErrorAction({error: 'wtf'}))
      // map(credentials => this.cognitoService.loginUser(credentials.username, credentials.password).subscribe(
      //   next: (value: CognitoLoginInfo) => new LoginUserSuccessAction(),
      //   error: (error: any) => 0,
      // )
      //   (info => new LoginUserSuccessAction({user: info.cognitoUser, accessToken: info.accessToken, idToken: info.idToken}))
      // )),
      // pluck(i => i)
    );
    
    @Effect()
    public logoutUser: Observable<Action> = this.actions.ofType<LogoutUserAction>(LOGOUT_USER).pipe(
      map(action => action.payload),
      map(payload => this.cognitoService.logoutUser(payload.user, payload.logoutGlobally)),
      map( _ => new LogoutUserSuccessAction()),
      catchError(error => of(new LogoutUserErrorAction(error)))
    );
}