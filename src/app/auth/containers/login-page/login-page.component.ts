import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Credentials } from '../../models/credentials';
import { LoginUserAction } from '../../actions/auth.actions';
import * as fromAuth from '../../reducers/auth.reducer';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  error$ = this.store.pipe(select(fromAuth.getError));

  constructor(private store: Store<fromAuth.AuthState>) { }

  ngOnInit() {
  }

  onSubmit(credentials: Credentials) {
    this.store.dispatch(new LoginUserAction({
      username: credentials.username,
      password: credentials.password
    }));
  }

}
