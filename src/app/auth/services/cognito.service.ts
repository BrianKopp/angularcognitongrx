import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { CognitoUser, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

export const PoolData = {
  ClientId: '',
  UserPoolId: ''
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
