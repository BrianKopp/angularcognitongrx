import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, ISignUpResult, CognitoUserSession } from 'amazon-cognito-identity-js';
import { environment } from '../../../environments/environment';
import { RegisterFormData } from '../models/registerformdata';
import * as fromAuth from '../reducers/auth.reducer';
import * as actions from '../actions/auth.actions';

export const PoolData = {
  ClientId: environment.cognitoAppClientId,
  UserPoolId: environment.cognitoUserPoolId
};

export interface CognitoLoginInfo {
  cognitoUser: CognitoUser | null;
  accessToken: string | null;
  idToken: string | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor(private store: Store<fromAuth.State>) { }

  loginUserObservable(username: string, password: string) : Observable<CognitoLoginInfo> {
    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = PoolData;
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    // create a subject for this
    let authSubject = new Subject<CognitoLoginInfo>();
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        console.log(`successfully logged in user ${cognitoUser.getUsername()}`);
        authSubject.next({
          cognitoUser: cognitoUser,
          accessToken: accessToken,
          idToken: idToken,
          error: null
        });
      },
      onFailure: (err) => {
        if (err === undefined || err.code === undefined) {
          authSubject.error('an unexpected error occurred');
        } else {
          switch(err.code) {
            case 'UserNotConfirmedException':
            case 'UserNotFoundException':
            case 'NotAuthorizedException':
            case 'ResourceNotFoundException':
              authSubject.error('invalid username or password')
              break;
            case 'PasswordResetRequiredException':
              authSubject.error('password reset required');
              break;
            default:
              authSubject.error('an unexpected error occurred');
              break;
          }
        }
        authSubject.error(err);
      }
    });
    return authSubject.asObservable();
  }

  loginUser(
    username: string,
    password: string,
    OnSuccess: (result: CognitoUserSession, cognitoUser: CognitoUser) => any,
    OnFailure: (err: any, cognitoUser: CognitoUser) => any
  ): void {
    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = PoolData;
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        OnSuccess(result, cognitoUser);
      },
      onFailure: (err) => {
        OnFailure(err, cognitoUser);
      }
    });
  }

  signUpUser(signUpData: RegisterFormData): Observable<CognitoUser> {
    const pool = new CognitoUserPool(PoolData);
    var attributeList = []
    attributeList.push(new CognitoUserAttribute({
      Name: 'email',
      Value: signUpData.email
    }));
    attributeList.push(new CognitoUserAttribute({
      Name: 'given_name',
      Value: signUpData.firstName
    }));
    attributeList.push(new CognitoUserAttribute({
      Name: 'family_name',
      Value: signUpData.lastName
    }));

    let registerSubject = new Subject<CognitoUser>();
    pool.signUp(
      signUpData.username,
      signUpData.password,
      attributeList,
      null,
      (err: Error, result: ISignUpResult) => {
        if (err) {
          console.log(err);
          registerSubject.error(err.message);
          return;
        }
        console.log('successfully signed up user', result.user);
        console.log('username', result.user.getUsername());
        registerSubject.next(result.user);
      }
    );
    return registerSubject.asObservable();
  }
  
  logoutUser(user: CognitoUser, logoutGlobally: boolean = false) {
    if (logoutGlobally) {
      user.signOut();
    } else {
      user.globalSignOut({
        onSuccess: (msg) => { return; },
        onFailure: (err) => new Error(`error signing out. ${err}`)
      });
    }
  }

  sendConfirmationCode(
    user: CognitoUser,
    code: string,
    callback: (err: any, result: any) => any
  ): void {
    user.confirmRegistration(code, true, (err: any, result: any) => {
      callback(err, result);
    })
  }
}
