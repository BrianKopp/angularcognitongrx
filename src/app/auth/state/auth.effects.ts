import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, switchMap, catchError, withLatestFrom, tap, concatMap } from 'rxjs/operators';
import { CognitoService } from '../services/cognito.service';
import * as Auth from './auth.actions';
import { LoginResponse, LoginResponseCode } from '../model/login-response';
import { of, defer } from 'rxjs';
import { SignupResponse } from '../model/signup-response';
import { ConfirmationCodeResponse } from '../model/confirmation-code-response';
import { AuthFacade } from './auth.facade';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { Router } from '@angular/router';
import { LoadUserFromStorageResponse } from '../model/load-user-from-storage-response';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AuthState>,
    private cognitoService: CognitoService,
    private authFacade: AuthFacade,
    private router: Router
  ) {}

  @Effect()
  login$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.LOGIN)).pipe(
    map((action: Auth.LoginAction) => action.payload),
    tap(({ username, password }) => {
      const user = this.cognitoService.createUserWithCredentials(username);
      const authDetails = this.cognitoService.createAuthDetails(username, password);
      this.store.dispatch(new Auth.LoginWaitingAction({ user, authDetails }));
    }),
    switchMap(({ username, password, redirectUrl }) => {
      return this.cognitoService.loginUser(username, password).pipe(
        map(response => {
          switch (response.code) {
            case LoginResponseCode.SUCCESS:
              return new Auth.LoginSuccessAction({ redirectUrl });
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

  loginSuccess$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.LOGIN_SUCCESS)).subscribe((action: Auth.LoginSuccessAction) => {
    this.router.navigate([action.payload.redirectUrl || '']);
  });

  @Effect()
  signup$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.SIGNUP)).pipe(
    map((action: Auth.SignupAction) => action.payload),
    tap(({ username, password }) => {
      const user = this.cognitoService.createUserWithCredentials(username);
      const authDetails = this.cognitoService.createAuthDetails(username, password);
      this.store.dispatch(new Auth.SignupWaitingAction({ user }));
    }),
    switchMap(({ username, password, email, attributeData }) => {
      return this.cognitoService.signupUser(username, password, email, attributeData).pipe(
        map((response: SignupResponse) => {
          if (response.errorMessage) {
            return new Auth.SignupFailureAction({ errorMessage: response.errorMessage });
          } else if (response.userIsConfirmed || response.userIsConfirmed === null) {
            return new Auth.SignupSuccessAction({
              cognitoUser: response.user
            });
          } else {
            return new Auth.SignupSuccessConfirmationRequiredAction({
              cognitoUser: response.user
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

  logoutSuccess$ = this.actions$.pipe(ofType(Auth.AuthActionTypes.LOGOUT_SUCCESS)).subscribe(_ => {
    this.router.navigate(['/login']);
  });

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

  submitConfirmationCodeSuccess$ = this.actions$
    .pipe(ofType(Auth.AuthActionTypes.SUBMIT_CONFIRMATION_CODE_SUCCESS))
    .subscribe((action: Auth.SubmitConfirmationCodeSuccessAction) => {
      this.router.navigate(['']);
    });

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

  @Effect({ dispatch: false })
  initAuth$ = defer(() => {
    // this.actions$.pipe(ofType(ROOT_EFFECTS_INIT)).pipe(
    // tap(initAction => {
    // console.log(initAction);
    return this.cognitoService.loadUserFromStorage().pipe(
      map((response: LoadUserFromStorageResponse) => {
        if (response.user && response.accessToken && response.idToken) {
          this.store.dispatch(
            new Auth.InitAuthUserRememberedAction({
              user: response.user,
              accessToken: response.accessToken,
              idToken: response.idToken
            })
          );
        }
      })
    );
  });
}
