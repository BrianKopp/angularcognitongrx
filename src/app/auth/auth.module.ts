import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from '../reducers';
import { AuthorizationEffects } from './effects/auth.effects';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthorizationEffects])
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
