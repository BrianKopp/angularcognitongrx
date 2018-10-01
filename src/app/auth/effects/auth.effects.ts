import { Injectable } from "@angular/core";
import { Actions } from '@ngrx/effects';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class AuthorizationEffects {
    constructor(
      private actions: Actions,
      private cognitoService: CognitoService
    ) { }
}