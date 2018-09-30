import { getAuthenticatedUser } from './../../auth/reducers/auth.reducer';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromRoot from '../../reducers';
import * as layoutActions from '../actions/layout.actions';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<app-layout>
  <app-sidenav [open]="showSidenav$ | async" (closeMenu)="closeSidenav()">
    <app-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/" icon="book" hint="View your protected-content">
      Protected Content Link 1
    </app-nav-item>
    <app-nav-item (navigate)="closeSidenav()" *ngIf="!(loggedIn$ | async)">
      Sign In
    </app-nav-item>
    <app-nav-item (navigate)="logout()" *ngIf="loggedIn$ | async">
      Sign Out
    </app-nav-item>
    <app-nav-item (navigate)="closeSidenav()">
      Close
    </app-nav-item>
  </app-sidenav>
  <app-toolbar (openMenu)="openSidenav()">
    Angular Cognito App
  </app-toolbar>

  <router-outlet></router-outlet>
</app-layout>
`
})
export class AppComponent implements OnInit {
  showSidenav$: Observable<boolean>;
  loggenIn$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.loggenIn$ = this.store.pipe(select(fromRoot.isAuthenticated));
  }

  ngOnInit() {
  }

  closeSidenav() {
    this.store.dispatch(new layoutActions.CloseSidenav());
  }
  openSidenav() {
    this.store.dispatch(new layoutActions.OpenSidenav());
  }
  logout() {
    this.closeSidenav();
    console.log('need to logout user here');
  }

}
