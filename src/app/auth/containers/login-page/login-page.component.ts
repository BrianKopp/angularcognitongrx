import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Credentials } from '../../models/credentials';
import { LoginUserAction } from '../../actions/auth.actions';
import { State } from '../../reducers/auth.reducer';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  onSubmit(credentials: Credentials) {
    this.store.dispatch(new LoginUserAction({
      username: credentials.username,
      password:credentials.password
    }));
  }

}
