import { CognitoUser, CognitoUserSession, AuthenticationDetails } from 'amazon-cognito-identity-js';

export enum LoginResponseCode {
  SUCCESS = 'LOGIN_SUCCESS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  REQUIRE_PASSWORD_RESET = 'REQUIRE_PASSWORD_RESET',
  NOT_CONFIRMED = 'NOT_CONFIRMED',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
  MFA_REQUIRED = 'MFA_REQUIRED'
}

export interface LoginResponse {
  code: LoginResponseCode;
  user?: CognitoUser;
  authData?: AuthenticationDetails;
  accessToken?: string;
  idToken?: string;
}
