import { Component } from '@angular/core';
import { AuthFacade } from '../../state/auth.facade';
import { AuthStates } from '../../model/auth-states';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  authState$ = this.authFacade.authCurrentState$;
  errorMessage$ = this.authFacade.errorMessage$;
  authStates = AuthStates;
  constructor(private authFacade: AuthFacade) {}

  onSubmitLogin(event) {
    if (event && event.username && event.password) {
      this.authFacade.loginUser(event.username, event.password);
    } else {
      console.log('invalid event data for onSubmitLogin function');
      console.log(event);
    }
  }

  onSubmitConfirmationCode(event) {
    if (event && event.confirmationCode) {
      this.authFacade.submitConfirmationCode(event.confirmationCode);
    } else {
      console.log('invalid event data for onSubmitConfirmationCode');
      console.log(event);
    }
  }
}
