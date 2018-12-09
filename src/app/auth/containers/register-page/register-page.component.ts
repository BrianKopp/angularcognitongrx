import { Component } from '@angular/core';
import { AuthFacade } from '../../state/auth.facade';
import { AuthStates } from '../../model/auth-states';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  authState$ = this.authFacade.authCurrentState$;
  errorMessage$ = this.authFacade.errorMessage$;
  authStates = AuthStates;
  constructor(private authFacade: AuthFacade) {}

  onSubmitSignUp(event) {
    if (event && event.username && event.password && event.email) {
      const attributes: { [key: string]: string } = {};
      if (event.firstName) {
        attributes['given_name'] = event.firstName;
      }
      if (event.lastName) {
        attributes['family_name'] = event.lastName;
      }
      this.authFacade.signupUser(event.username, event.password, event.email, attributes);
    } else {
      console.log('invalid event data for onSubmitSignUp');
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
