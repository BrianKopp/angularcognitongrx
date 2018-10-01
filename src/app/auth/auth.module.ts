import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';


import { AuthorizationEffects } from './effects/auth.effects';
import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core/core.module';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MaterialModule } from '../material';
import { reducer } from './reducers/auth.reducer';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterPageComponent } from './containers/register-page/register-page.component';
import { ConfirmationCodeFormComponent } from './components/confirmation-code-form/confirmation-code-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    MaterialModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducer),
    EffectsModule.forFeature([AuthorizationEffects])
  ],
  declarations: [LoginPageComponent, LoginFormComponent, RegisterFormComponent, RegisterPageComponent, ConfirmationCodeFormComponent]
})
export class AuthModule { }
