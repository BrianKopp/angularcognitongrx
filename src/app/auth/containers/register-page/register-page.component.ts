import { CognitoService } from './../../services/cognito.service';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromAuth from '../../reducers/auth.reducer';
import { RegisterFormData } from '../../models/registerformdata';
import { AuthLoadingAction, AuthErrorAction, ConfirmationRequiredAction, LoginUserSuccessAction, ConfirmedRequireLoginAction } from '../../actions/auth.actions';
import { ISignUpResult, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  error$ = this.store.pipe(select(fromAuth.getError));
  isLoading$ = this.store.pipe(select(fromAuth.isLoading));
  confirmationCodeRequired$ = this.store.pipe(select(fromAuth.waitingOnConfirmationCode));
  user$ = this.store.pipe(select(fromAuth.getUser));
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

  onSubmitSignUp(formData: RegisterFormData) {
    this.store.dispatch(new AuthLoadingAction());
    this.cognito.signUpUser(formData, (err: Error, result: ISignUpResult) => {
      if (err) {
        console.log(err);
        this.store.dispatch(new AuthErrorAction({error: err.message}));
        return;
      }
      console.log('successfully signed up user', result.user);
      this.store.dispatch(new ConfirmationRequiredAction({user: result.user}));
    });
  }

  onSubmitConfirmationCode(formData) {
    this.store.dispatch(new AuthLoadingAction());
    this.cognito.sendConfirmationCode(
      this.currentUser,
      formData.Confirmation,
      (err: any, _: any) => {
        if (err) {
          this.store.dispatch(new AuthErrorAction({error: err.message}));
        } else {
          this.cognito.loginUser(
            this.currentUser.getUsername(),
            formData.Password,
            (result: CognitoUserSession, cognitoUser: CognitoUser) => {
              this.store.dispatch(new LoginUserSuccessAction({
                user: cognitoUser,
                accessToken: result.getAccessToken().getJwtToken(),
                idToken: result.getIdToken().getJwtToken()
              }));
            },
            (_: any, __: CognitoUser) => {
              this.store.dispatch(new ConfirmedRequireLoginAction({
                message: 'validation code correct, invalid password'
              }));
            }
          )
        }
      }
    );
  }
}
