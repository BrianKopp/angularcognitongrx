import { StoreModule } from '@ngrx/store';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from '../core/core.module';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MaterialModule } from '../material';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterPageComponent } from './containers/register-page/register-page.component';
import { ConfirmationCodeFormComponent } from './components/confirmation-code-form/confirmation-code-form.component';
import { authReducer } from './state/auth.reducer';
import { AuthEffects } from './state/auth.effects';
import { AuthGuard } from './services/auth-guard.service';
import { AuthFacade } from './state/auth.facade';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { ToastService } from './services/toast.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSnackBarModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  declarations: [
    LoginPageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    RegisterPageComponent,
    ConfirmationCodeFormComponent
  ],
  providers: [ToastService]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [AuthGuard, AuthFacade]
    };
  }
}
