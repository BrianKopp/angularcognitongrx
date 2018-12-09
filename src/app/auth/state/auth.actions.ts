import { Action } from '@ngrx/store';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

export enum AuthActionTypes {
  INIT_AUTH_USER_REMEMBERED = '[Auth] Init Auth User Remembered',

  LOGIN = '[Auth] Login',
  LOGIN_WAITING = '[Auth] Login Waiting',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',

  SIGNUP = '[Auth] Signup',
  SIGNUP_WAITING = '[Auth] Signup Waiting',
  SIGNUP_SUCCESS = '[Auth] Signup Success',
  SIGNUP_FAILURE = '[Auth] Signup Failure',

  REQUIRE_MFA = '[Auth] Multi-Factor Authentication Required',
  REQUIRE_NEW_PASSWORD = '[Auth] New Password Required',
  REQUIRE_USER_CONFIRMATION = '[Auth] User Confirmation Required',

  SUBMIT_CONFIRMATION_CODE = '[Auth] Submit Confirmation Code',
  SUBMIT_CONFIRMATION_CODE_SUCCESS = '[Auth] Submit Confirmation Code SUCCESS',
  SUBMIT_CONFIRMATION_CODE_FAILURE = '[Auth] Submit Confirmation Code FAILURE',

  SUBMIT_MFA = '[Auth] Submit MFA Code',
  SUBMIT_MFA_SUCCESS = '[Auth] Submit MFA Code Success',
  SUBMIT_MFA_FAILURE_INVALID_CODE = '[Auth] Submit MFA Failure Invalid Code',

  SUBMIT_NEW_PASSWORD = '[Auth] Submit New Password',
  SUBMIT_NEW_PASSWORD_SUCCESS = '[Auth] Submit New Password Success',
  SUBMIT_NEW_PASSWORD_FAILURE = '[Auth] Submit New Password Failure',

  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS = '[Auth] Logout SUccess'
}
export class InitAuthUserRememberedAction implements Action {
  readonly type = AuthActionTypes.INIT_AUTH_USER_REMEMBERED;
  constructor(public payload: { user: CognitoUser; accessToken: string; idToken: string }) {}
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: { username: string; password: string; redirectUrl?: string }) {}
}

export class LoginWaitingAction implements Action {
  readonly type = AuthActionTypes.LOGIN_WAITING;
  constructor(public payload: { user: CognitoUser; authDetails: AuthenticationDetails }) {}
}

export class LoginSuccessAction implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: { redirectUrl?: string }) {}
}

export class LoginFailureAction implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: { errorMessage: string }) {}
}

export class SignupAction implements Action {
  readonly type = AuthActionTypes.SIGNUP;
  constructor(public payload: { username: string; password: string; email: string; attributeData: { [key: string]: string } }) {}
}

export class SignupWaitingAction implements Action {
  readonly type = AuthActionTypes.SIGNUP_WAITING;
  constructor(public payload: { user: CognitoUser }) {}
}

export class SignupSuccessAction implements Action {
  readonly type = AuthActionTypes.SIGNUP_SUCCESS;
  constructor(public payload: { cognitoUser: CognitoUser }) {}
}

export class SignupFailureAction implements Action {
  readonly type = AuthActionTypes.SIGNUP_FAILURE;
  constructor(public payload: { errorMessage: string }) {}
}

export class RequireMFACodeAction implements Action {
  readonly type = AuthActionTypes.REQUIRE_MFA;
  constructor() {}
}

export class RequireNewPasswordAction implements Action {
  readonly type = AuthActionTypes.REQUIRE_NEW_PASSWORD;
  constructor() {}
}

export class RequireUserConfirmationAction implements Action {
  readonly type = AuthActionTypes.REQUIRE_USER_CONFIRMATION;
  constructor() {}
}

export class SubmitMFACodeAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_MFA;
  constructor(public payload: { mfaCode: string }) {}
}

export class SubmitMFACodeSuccessAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_MFA_SUCCESS;
  constructor() {}
}

export class SubmitMFACodeFailureInvalidAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_MFA_FAILURE_INVALID_CODE;
  constructor(public payload: { errorMessage: string }) {}
}

export class SubmitConfirmationCodeAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_CONFIRMATION_CODE;
  constructor(public payload: { confirmationCode: string }) {}
}

export class SubmitConfirmationCodeSuccessAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_CONFIRMATION_CODE_SUCCESS;
  constructor() {}
}

export class SubmitConfirmationCodeFailureAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_CONFIRMATION_CODE_FAILURE;
  constructor(public payload: { errorMessage: string }) {}
}

export class SubmitNewPasswordAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_NEW_PASSWORD;
  constructor(public payload: { newPassword: string }) {}
}

export class SubmitNewPasswordSuccessAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_NEW_PASSWORD_SUCCESS;
  constructor() {}
}

export class SubmitNewPasswordFailureAction implements Action {
  readonly type = AuthActionTypes.SUBMIT_NEW_PASSWORD_FAILURE;
  constructor(public payload: { errorMessage: string }) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LOGOUT;
  constructor() {}
}

export class LogoutSuccessAction implements Action {
  readonly type = AuthActionTypes.LOGOUT_SUCCESS;
  constructor() {}
}

export type AuthActions =
  | InitAuthUserRememberedAction
  | LoginAction
  | LoginWaitingAction
  | LoginSuccessAction
  | LoginFailureAction
  | SignupAction
  | SignupWaitingAction
  | SignupSuccessAction
  | SignupFailureAction
  | RequireMFACodeAction
  | RequireUserConfirmationAction
  | RequireNewPasswordAction
  | SubmitConfirmationCodeAction
  | SubmitConfirmationCodeSuccessAction
  | SubmitConfirmationCodeFailureAction
  | SubmitMFACodeAction
  | SubmitMFACodeSuccessAction
  | SubmitMFACodeFailureInvalidAction
  | SubmitNewPasswordAction
  | SubmitNewPasswordSuccessAction
  | SubmitNewPasswordFailureAction
  | LogoutAction
  | LogoutSuccessAction;
