import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAuth from '../../reducers/auth.reducer';
import { RegisterFormData } from '../../models/registerformdata';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  error$ = null;

  constructor(private store: Store<fromAuth.AuthState>) { }

  ngOnInit() {
  }

  onSubmit(formData: RegisterFormData) {
    console.log('received submit action');
  }

}
