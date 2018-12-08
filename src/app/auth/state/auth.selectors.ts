import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { AuthStates } from '../model/auth-states';

const getAuth = createFeatureSelector<AuthState>('auth');

const getAuthState = createSelector(
  getAuth,
  (state: AuthState) => state
);

export const getUser = createSelector(
  getAuthState,
  state => state.user
);
export const getErrorMessage = createSelector(
  getAuthState,
  state => state.errorMessage
);
export const getAccessToken = createSelector(
  getAuthState,
  state => state.accessToken
);
export const getIdToken = createSelector(
  getAuthState,
  state => state.idToken
);
export const getAuthCurrentState = createSelector(
  getAuthState,
  state => state.authState
);
export const getAuthCurrentStateIsLoggedIn = createSelector(
  getAuthState,
  state => state.authState === AuthStates.LOGGED_IN
);
export const getIsLoadingLogin = createSelector(
  getAuthState,
  state => state.isLoading.login
);
export const getIsLoadingSignup = createSelector(
  getAuthState,
  state => state.isLoading.signup
);
export const getIsLoadingMfa = createSelector(
  getAuthState,
  state => state.isLoading.mfa
);
export const getIsLoadingConfirmationCode = createSelector(
  getAuthState,
  state => state.isLoading.confirmationCode
);
export const getIsLoadingLogout = createSelector(
  getAuthState,
  state => state.isLoading.logout
);
export const getIsLoadingNewPassword = createSelector(
  getAuthState,
  state => state.isLoading.newPassword
);
