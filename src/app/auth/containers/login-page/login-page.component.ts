import { getUser } from './../../reducers/auth.reducer';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Credentials } from '../../models/credentials';
import * as fromAuth from '../../reducers/auth.reducer';
import { CognitoService } from '../../services/cognito.service';
import { AuthLoadingAction, AuthErrorAction, LoginUserSuccessAction, ConfirmationRequiredAction } from '../../actions/auth.actions';
import { CognitoUserSession, CognitoUser } from 'amazon-cognito-identity-js';
import { BehaviorSubject } from 'rxjs';
import { map, tap, withLatestFrom, last } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  error$ = this.store.pipe(select(fromAuth.getError));
  isLoading$ = this.store.pipe(select(fromAuth.isLoading));
  confirmationCodeRequired$ = this.store.pipe(select(fromAuth.waitingOnConfirmationCode));
  user$ = this.store.pipe(select(fromAuth.getUser))
  currentUser: CognitoUser = null;

  constructor(private store: Store<fromAuth.AuthState>, private cognito: CognitoService) { }

  ngOnInit() {
    let subject = new BehaviorSubject<CognitoUser>(null);
    this.user$.subscribe(subject);
    subject.subscribe(result => this.setLastUser(result));
  }

  setLastUser(user: CognitoUser) {
    this.currentUser = user;
  }

  onSubmitLogin(credentials: Credentials) {
    this.store.dispatch(new AuthLoadingAction());
    this.cognito.loginUser(
      credentials.username,
      credentials.password,
      (result: CognitoUserSession, cognitoUser: CognitoUser) => {
        console.log(`successfully logged in user ${cognitoUser.getUsername()}`);
        this.store.dispatch(new LoginUserSuccessAction({
          user: cognitoUser,
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken()
        }));
      },
      (err: any, cognitoUser: CognitoUser): any => {
        let errMsg: string = 'an unexpected error occurred';
        if (err !== undefined && err.code !== undefined) {
          switch(err.code) {
            case 'UserNotConfirmedException':
              this.store.dispatch(new ConfirmationRequiredAction({user: cognitoUser}));
              return;
            case 'UserNotFoundException':
            case 'NotAuthorizedException':
            case 'ResourceNotFoundException':
              errMsg = 'invalid username or password';
              break;
            case 'PasswordResetRequiredException':
              errMsg = 'password reset required';
              break;
            default:
              break;
          }
        }
        this.store.dispatch(new AuthErrorAction({error: errMsg}));
      }
    );
  }

  onSubmitConfirmationCode(formData) {
    this.store.dispatch(new AuthLoadingAction());
    //this.user$.pipe(withLatestFrom(
    //withLatestFrom([this.user$]).map();
    this.cognito.sendConfirmationCode(
      this.currentUser,
      formData.Confirmation,
      (err: any, result: any) => {
        if (err) {
          this.store.dispatch(new AuthErrorAction({error: err.message}));
        } else {
        }
    });
  }
}
