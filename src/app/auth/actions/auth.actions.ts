import { CognitoUser } from 'amazon-cognito-identity-js';
import { Action } from '@ngrx/store';
import { createActionType } from '../../core/shared/utils';
import { RegisterFormData } from '../models/registerformdata';

export enum CognitoStates {
  LOGGED_OUT = 'LOGGED_OUT',
  LOGGED_IN = 'LOGGED_IN',
  NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  EMAIL_VERIFICATION_REQUIRED = 'EMAIL_VERIFICATION_REQUIRED',
  CONFIRMATION_REQUIRED = 'CONFIRMATION_REQUIRED'
}

export const AUTH_LOADING = createActionType('AUTH_LOADING');
export const AUTH_ERROR = createActionType('AUTH_ERROR');

export const LOGIN_USER_SUCCESS = createActionType('LOGIN_USER_SUCCESS');
export const LOGOUT_USER_SUCCESS = createActionType('LOGOUT_USER_SUCCESS');

export const CONFIRMATION_REQUIRED = createActionType(CognitoStates.CONFIRMATION_REQUIRED);

export class AuthLoadingAction implements Action {
  public type: string = AUTH_LOADING;
  constructor() {}
}

export class AuthErrorAction implements Action {
  public type: string = AUTH_ERROR;
  constructor(public payload: { error: string }) {}
}

export class LoginUserSuccessAction implements Action {
    public type: string = LOGIN_USER_SUCCESS;
    constructor(public payload: {user: CognitoUser, accessToken: string, idToken: string}) {}
}

export class LogoutUserSuccessAction implements Action {
    public type: string = LOGOUT_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export class ConfirmationRequiredAction implements Action {
  public type: string = CONFIRMATION_REQUIRED;
  constructor(public payload: {user: CognitoUser}) {}
}

export type Actions =
    AuthLoadingAction
    | AuthErrorAction
    | LoginUserSuccessAction
    | LogoutUserSuccessAction
    | ConfirmationRequiredAction;
