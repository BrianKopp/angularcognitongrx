import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reducers } from '../reducers';
import { EffectsModule } from '@ngrx/effects';
import { AuthorizationEffects } from './effects/auth.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthorizationEffects])
  ],
  declarations: []
})
export class AuthModule { }
