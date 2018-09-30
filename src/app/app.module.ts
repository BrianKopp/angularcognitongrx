import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

import { CoreModule } from './core/core.module';
import { AppComponent } from './core/containers/app.component';

import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';

import { reducers } from './reducers';
import { metaReducers } from './reducers/index';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    CoreModule,
    AuthModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
