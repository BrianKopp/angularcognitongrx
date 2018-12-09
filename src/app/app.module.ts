import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';
import { AppComponent } from './core/containers/app/app.component';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';

import { reducers, metaReducers } from './reducers';
import * as prodEnv from '../environments/environment.prod';
import * as devEnv from '../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule.forRoot(
      isDevMode
        ? { cognitoAppClientId: devEnv.environment.cognitoAppClientId, cognitoUserPoolId: devEnv.environment.cognitoUserPoolId }
        : { cognitoAppClientId: prodEnv.environment.cognitoAppClientId, cognitoUserPoolId: prodEnv.environment.cognitoUserPoolId }
    ),
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'Cognito App',
      logOnly: prodEnv.environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
