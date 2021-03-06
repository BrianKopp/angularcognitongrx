import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AuthState } from './auth.reducer';
import {
  getUser,
  getErrorMessage,
  getAccessToken,
  getIdToken,
  getAuthCurrentState,
  getIsLoadingLogin,
  getIsLoadingSignup,
  getIsLoadingMfa,
  getIsLoadingConfirmationCode,
  getIsLoadingLogout,
  getIsLoadingNewPassword,
  getAuthCurrentStateIsLoggedIn
} from './auth.selectors';
import { LoginAction, SubmitConfirmationCodeAction, SignupAction, LogoutAction } from './auth.actions';

@Injectable()
export class AuthFacade {
  cognitoUser$ = this.store.pipe(select(getUser));
  errorMessage$ = this.store.pipe(select(getErrorMessage));
  accessToken$ = this.store.pipe(select(getAccessToken));
  idToken$ = this.store.pipe(select(getIdToken));
  authCurrentState$ = this.store.pipe(select(getAuthCurrentState));
  isLoggedIn$ = this.store.pipe(select(getAuthCurrentStateIsLoggedIn));
  isLoadingLogin$ = this.store.pipe(select(getIsLoadingLogin));
  isLoadingSignup$ = this.store.pipe(select(getIsLoadingSignup));
  isLoadingMfa$ = this.store.pipe(select(getIsLoadingMfa));
  isLoadingConfirmationCode$ = this.store.pipe(select(getIsLoadingConfirmationCode));
  isLoadingLogout$ = this.store.pipe(select(getIsLoadingLogout));
  isLoadingNewPassword$ = this.store.pipe(select(getIsLoadingNewPassword));
  constructor(private store: Store<AuthState>) {}

  loginUser(username: string, password: string) {
    this.store.dispatch(new LoginAction({ username, password }));
  }
  submitConfirmationCode(confirmationCode: string) {
    this.store.dispatch(new SubmitConfirmationCodeAction({ confirmationCode }));
  }
  signupUser(username: string, password: string, email: string, attributeData: { [key: string]: string }) {
    this.store.dispatch(new SignupAction({ username, password, email, attributeData }));
  }
  logoutUser() {
    this.store.dispatch(new LogoutAction());
  }
}
