import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from "rxjs";
import { map, switchMap, catchError } from 'rxjs/operators';

import { CognitoService } from '../services/cognito.service';
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
    constructor(private actions: Actions, private cognitoService: CognitoService){}
    @Effect()
    public loginUser: Observable<Action> = this.actions.ofType<LoginUserAction>(LOGIN_USER).pipe(
      map(action => action.payload),
      switchMap(credentials => this.cognitoService.loginUser(credentials.username, credentials.password)),
      map(info => new LoginUserSuccessAction({
        user: info.cognitoUser,
        accessToken: info.accessToken,
        idToken: info.idToken
      })),
      catchError(error => of(new LoginUserErrorAction(error)))
    );
    
    @Effect()
    public logoutUser: Observable<Action> = this.actions.ofType<LogoutUserAction>(LOGOUT_USER).pipe(
      map(action => action.payload),
      map(payload => this.cognitoService.logoutUser(payload.user, payload.logoutGlobally)),
      map( _ => new LogoutUserSuccessAction()),
      catchError(error => of(new LogoutUserErrorAction(error)))
    );
}