import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  @Input() errorMessage: string | null;
  @Output() submitEvent = new EventEmitter<{ username: string; password: string }>();

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor() {}

  submit() {
    if (this.loginForm.valid) {
      this.submitEvent.emit(this.loginForm.value);
    }
  }
}
