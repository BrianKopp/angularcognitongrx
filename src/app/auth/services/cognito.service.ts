import { Injectable, OnInit, isDevMode } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { LoginResponse, LoginResponseCode } from '../model/login-response';
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute,
  ISignUpResult
} from 'amazon-cognito-identity-js';
import * as DevEnv from 'src/environments/environment';
import * as ProdEnv from 'src/environments/environment.prod';
import { SignupResponse } from '../model/signup-response';
import { ConfirmationCodeResponse } from '../model/confirmation-code-response';
import { LoadUserFromStorageResponse } from '../model/load-user-from-storage-response';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private poolData: { ClientId: string; UserPoolId: string };
  constructor() {
    if (isDevMode) {
      this.poolData = {
        ClientId: DevEnv.environment.cognitoAppClientId,
        UserPoolId: DevEnv.environment.cognitoUserPoolId
      };
    } else {
      this.poolData = {
        ClientId: ProdEnv.environment.cognitoAppClientId,
        UserPoolId: ProdEnv.environment.cognitoUserPoolId
      };
    }
  }

  createUserWithCredentials(username: string): CognitoUser {
    return new CognitoUser({
      Username: username,
      Pool: new CognitoUserPool(this.poolData)
    });
  }

  createAuthDetails(username: string, password: string): AuthenticationDetails {
    return new AuthenticationDetails({
      Username: username,
      Password: password
    });
  }

  loginUser(username: string, password: string): Observable<LoginResponse> {
    return Observable.create((loginSubject: Subject<LoginResponse>) => {
      const cognitoUser = this.createUserWithCredentials(username);
      const authDetails = this.createAuthDetails(username, password);
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result: CognitoUserSession) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          loginSubject.next({
            code: LoginResponseCode.SUCCESS,
            user: cognitoUser,
            accessToken,
            idToken
          });
        },
        onFailure: err => {
          if (err === undefined || err.code === undefined) {
            loginSubject.next({
              code: LoginResponseCode.UNKNOWN
            });
          } else {
            switch (err.code) {
              case 'UserNotConfirmedException':
                loginSubject.next({
                  code: LoginResponseCode.NOT_CONFIRMED
                });
                break;
              case 'UserNotFoundException':
              case 'NotAuthorizedException':
              case 'ResourceNotFoundException':
                loginSubject.next({
                  code: LoginResponseCode.INVALID_CREDENTIALS
                });
                break;
              case 'PasswordResetRequiredException':
                loginSubject.next({
                  code: LoginResponseCode.REQUIRE_PASSWORD_RESET
                });
                break;
              default:
                loginSubject.next({
                  code: LoginResponseCode.UNKNOWN
                });
                break;
            }
          }
        },
        mfaRequired: response => {
          console.log('mfa required');
          console.log(response);
          loginSubject.next({
            code: LoginResponseCode.MFA_REQUIRED,
            user: cognitoUser,
            authData: authDetails
          });
        },
        newPasswordRequired: response => {
          console.log('new password required');
          console.log(response);
          loginSubject.next({
            code: LoginResponseCode.REQUIRE_PASSWORD_RESET,
            user: cognitoUser,
            authData: authDetails
          });
        }
      });
    });
  }

  signupUser(
    username: string,
    password: string,
    email: string,
    attributes?: { [key: string]: string }
  ): Observable<SignupResponse> {
    return Observable.create((signupSubject: Subject<SignupResponse>) => {
      const poolData = new CognitoUserPool(this.poolData);
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email
        })
      ];

      if (attributes) {
        Object.keys(attributes).forEach((attributeName: string) => {
          attributeList.push(
            new CognitoUserAttribute({
              Name: attributeName,
              Value: attributes[attributeName]
            })
          );
        });
      }

      poolData.signUp(username, password, attributeList, null, (err: Error, result: ISignUpResult) => {
        if (err) {
          let errorMessage = 'An unknown error occurred';
          if (err['code']) {
            switch (err['code']) {
              case 'InvalidParameterException':
                errorMessage = 'Not all required user properties were provided';
                break;
              case 'InvalidPasswordException':
                errorMessage = err.message;
                break;
              case 'UsernameExistsException':
                errorMessage = err.message;
                break;
              default:
                break;
            }
          }
          signupSubject.next({ errorMessage: errorMessage });
        } else {
          signupSubject.next({
            user: result.user,
            userIsConfirmed: result.userConfirmed,
            authDetails: new AuthenticationDetails({ Username: username, Password: password })
          });
        }
      });
    });
  }

  logoutUser(user: CognitoUser): void {
    user.signOut();
  }

  loadUserFromStorage(): Observable<LoadUserFromStorageResponse> {
    return Observable.create((loadUserSubject: Subject<LoadUserFromStorageResponse>) => {
      const userPool = new CognitoUserPool(this.poolData);
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
          if (err) {
            loadUserSubject.next({ errorMessage: err.message });
          } else {
            loadUserSubject.next({
              user: cognitoUser,
              accessToken: session.getAccessToken().getJwtToken(),
              idToken: session.getIdToken().getJwtToken()
            });
          }
          loadUserSubject.next({});
        });
      } else {
        loadUserSubject.next({});
      }
    });
  }

  submitConfirmationCode(user: CognitoUser, code: string): Observable<ConfirmationCodeResponse> {
    return Observable.create((confirmationSubject: Subject<ConfirmationCodeResponse>) => {
      user.confirmRegistration(code, true, (err: any, _: any) => {
        if (err) {
          confirmationSubject.next({ errorMessage: err, success: false });
        } else {
          confirmationSubject.next({ success: true });
        }
      });
    });
  }

  submitMfaCode(user: CognitoUser, code: string): Observable<LoginResponse> {
    return Observable.create((confirmationSubject: Subject<LoginResponse>) => {
      user.sendMFACode(code, {
        onSuccess: (session: CognitoUserSession) => {
          confirmationSubject.next({
            code: LoginResponseCode.SUCCESS,
            user,
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getAccessToken().getJwtToken()
          });
        },
        onFailure: (_: any) => {
          confirmationSubject.next({
            code: LoginResponseCode.MFA_REQUIRED
          });
        }
      });
    });
  }
}
