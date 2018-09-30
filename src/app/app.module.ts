import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';
import { AppComponent } from './core/containers/app.component';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';

import { reducers } from './reducers';
import { metaReducers } from './reducers/index';
import { environment } from '../environments/environment.prod';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'Cognito App',
      logOnly: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
