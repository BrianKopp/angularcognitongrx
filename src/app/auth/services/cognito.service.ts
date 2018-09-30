import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, ISignUpResult } from 'amazon-cognito-identity-js';
import { environment } from '../../../environments/environment';
import { SignUpData } from '../models/signupdata';

export const PoolData = {
  ClientId: environment.cognitoAppClientId,
  UserPoolId: environment.cognitoUserPoolId
};

export class CognitoLoginInfo {
  constructor(public cognitoUser: CognitoUser, public accessToken: string, public idToken: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }

  loginUser(username: string, password: string): Observable<CognitoLoginInfo> {
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
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        return new CognitoLoginInfo(cognitoUser, accessToken, idToken);
      },
      onFailure: (err) => {
        return Observable.throw(new Error(err));
      }
    });
    return Observable.throw(new Error('loginUser did not complete successfully'));
  }
  signUpUser(signUpData: SignUpData) {
    const pool = new CognitoUserPool(PoolData);
    var attributeList = []
    attributeList.push(new CognitoUserAttribute({
      Name: 'email',
      Value: signUpData.emailAddress
    }));
    attributeList.push(new CognitoUserAttribute({
      Name: 'given_name',
      Value: signUpData.firstName
    }));
    attributeList.push(new CognitoUserAttribute({
      Name: 'family_name',
      Value: signUpData.lastName
    }));
    pool.signUp(
      signUpData.username,
      signUpData.password,
      attributeList,
      null,
      (err: Error, result: ISignUpResult) => {
        if (err) {
          alert(err);
          return;
        }
        console.log('successfully signed up user', result.user);
        console.log('username', result.user.getUsername());
      }
    )
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
}
