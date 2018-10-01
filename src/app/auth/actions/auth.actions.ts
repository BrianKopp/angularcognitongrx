import { CognitoUser } from 'amazon-cognito-identity-js';
import { Action } from '@ngrx/store';
import { createActionType } from '../../core/shared/utils';
import { RegisterFormData } from '../models/registerformdata';


export const LOGIN_USER = createActionType('LOGIN_USER');
export const LOGIN_USER_SUCCESS = createActionType('LOGIN_USER_SUCCESS');
export const LOGIN_USER_ERROR = createActionType('LOGIN_USER_ERROR');

export const LOGOUT_USER = createActionType('LOGOUT_USER');
export const LOGOUT_USER_SUCCESS = createActionType('LOGOUT_USER_SUCCESS');
export const LOGOUT_USER_ERROR = createActionType('LOGOUT_USER_ERROR');

export const SIGNUP_USER = createActionType('SIGNUP_USER');
export const SIGNUP_USER_SUCCESS = createActionType('SIGNUP_USER_SUCCESS');
export const SIGNUP_USER_ERROR = createActionType('SIGNUP_USER_ERROR');

export class LoginUserAction implements Action {
    public type: string = LOGIN_USER;
    constructor(public payload: {username: string, password: string}) {}
}

export class LoginUserSuccessAction implements Action {
    public type: string = LOGIN_USER_SUCCESS;
    constructor(public payload: {user: CognitoUser, accessToken: string, idToken: string}) {}
}

export class LoginUserErrorAction implements Action {
    public type: string = LOGIN_USER_ERROR;
    constructor(public payload: {error: any}) {}
}

export class LogoutUserAction implements Action {
    public type: string = LOGOUT_USER;
    constructor(public payload: {user: CognitoUser, logoutGlobally: boolean}) {}
}

export class LogoutUserSuccessAction implements Action {
    public type: string = LOGOUT_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export class LogoutUserErrorAction implements Action {
    public type: string = LOGOUT_USER_ERROR;
    constructor(public payload: string) {}
}

export class SignupUserAction implements Action {
  public type: string = SIGNUP_USER;
  constructor(public payload: {data: RegisterFormData}) {}
}

export class SignupUserSuccessAction implements Action {
  public type: string = SIGNUP_USER_SUCCESS;
  constructor(public payload?: any) {}
}

export class SignupUserErrorAction implements Action {
  public type: string = SIGNUP_USER_ERROR;
  constructor(public payload: {error: string}) {}
}

export type Actions =
    LoginUserAction
    | LoginUserSuccessAction
    | LoginUserErrorAction
    | LogoutUserAction
    | LogoutUserSuccessAction
    | LogoutUserErrorAction
    | SignupUserAction
    | SignupUserSuccessAction
    | SignupUserErrorAction;
