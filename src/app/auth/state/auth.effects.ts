import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { CognitoService } from '../services/cognito.service';
import * as Auth from './auth.actions';
import { LoginResponse, LoginResponseCode } from '../model/login-response';
import { of } from 'rxjs';
import { SignupResponse } from '../model/signup-response';
import { ConfirmationCodeResponse } from '../model/confirmation-code-response';
import { AuthFacade } from './auth.facade';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private cognitoService: CognitoService,
    private authFacade: AuthFacade
  ) {}

  @Effect()
  login$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.LOGIN)).pipe(
    map((action: Auth.LoginAction) => action.payload),
    tap(({ username, password }) => {
      const user = this.cognitoService.createUserWithCredentials(username);
      const authDetails = this.cognitoService.createAuthDetails(username, password);
      this.store.dispatch(new Auth.LoginWaitingAction({ user, authDetails }));
    }),
    switchMap(({ username, password }) => {
      return this.cognitoService.loginUser(username, password).pipe(
        map(response => {
          switch (response.code) {
            case LoginResponseCode.SUCCESS:
              return new Auth.LoginSuccessAction();
            case LoginResponseCode.INVALID_CREDENTIALS:
              return new Auth.LoginFailureAction({ errorMessage: 'Incorrect username or password' });
            case LoginResponseCode.MFA_REQUIRED:
              return new Auth.RequireMFACodeAction();
            case LoginResponseCode.NOT_CONFIRMED:
              return new Auth.RequireUserConfirmationAction();
            case LoginResponseCode.REQUIRE_PASSWORD_RESET:
              return new Auth.RequireNewPasswordAction();
            case LoginResponseCode.UNKNOWN:
            default:
              return new Auth.LoginFailureAction({ errorMessage: 'Login failed' });
          }
        }),
        catchError(error => of(new Auth.LoginFailureAction({ errorMessage: error })))
      );
    })
  );

  @Effect()
  signup$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.SIGNUP)).pipe(
    map((action: Auth.SignupAction) => action.payload),
    tap(({ username, password }) => {
      const user = this.cognitoService.createUserWithCredentials(username);
      const authDetails = this.cognitoService.createAuthDetails(username, password);
      this.store.dispatch(new Auth.SignupWaitingAction({ user, authDetails }));
    }),
    switchMap(({ username, password, email, attributeData }) => {
      return this.cognitoService.signupUser(username, password, email, attributeData).pipe(
        map((response: SignupResponse) => {
          if (response.errorMessage) {
            return new Auth.SignupFailureAction({ errorMessage: response.errorMessage });
          } else {
            return new Auth.SignupSuccessAction({
              cognitoUser: response.user,
              userIsConfirmed: response.userIsConfirmed,
              authDetails: response.authDetails
            });
          }
        }),
        catchError(err => of(new Auth.SignupFailureAction({ errorMessage: err })))
      );
    })
  );

  @Effect()
  logout$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.LOGOUT)).pipe(
    withLatestFrom(this.authFacade.cognitoUser$),
    tap(([_, user]) => {
      this.cognitoService.logoutUser(user);
    }),
    switchMap(_ => {
      return of(new Auth.LogoutSuccessAction());
    })
  );

  @Effect()
  submitConfirmationCode$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.SUBMIT_CONFIRMATION_CODE)).pipe(
    map((action: Auth.SubmitConfirmationCodeAction) => action.payload.confirmationCode),
    withLatestFrom(this.authFacade.cognitoUser$),
    switchMap(([code, user]) => {
      return this.cognitoService.submitConfirmationCode(user, code).pipe(
        map((response: ConfirmationCodeResponse) => {
          if (response.errorMessage || !response.success) {
            const errMsg = response.errorMessage ? response.errorMessage : 'Error submitting confirmation code';
            return new Auth.SubmitConfirmationCodeFailureAction({ errorMessage: errMsg });
          } else {
            return new Auth.SubmitConfirmationCodeSuccessAction();
          }
        }),
        catchError(err => of(new Auth.SubmitConfirmationCodeFailureAction({ errorMessage: err })))
      );
    })
  );

  @Effect()
  submitMfaCode$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.SUBMIT_MFA)).pipe(
    map((action: Auth.SubmitMFACodeAction) => action.payload.mfaCode),
    withLatestFrom(this.authFacade.cognitoUser$),
    switchMap(([code, user]) => {
      return this.cognitoService.submitMfaCode(user, code).pipe(
        map((response: LoginResponse) => {
          if (response.code === LoginResponseCode.MFA_REQUIRED) {
            return new Auth.SubmitMFACodeFailureInvalidAction({ errorMessage: 'Code invalid' });
          } else {
            return new Auth.SubmitMFACodeSuccessAction();
          }
        }),
        catchError(err => of(new Auth.SubmitMFACodeFailureInvalidAction({ errorMessage: err })))
      );
    })
  );
}