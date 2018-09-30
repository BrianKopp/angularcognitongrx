import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <app-layout>
  <app-sidenav [open]="showSidenav$ | async" (closeMenu)="closeSidenav()">
    <app-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/" icon="book" hint="View your book collection">
      My Collection
    </app-nav-item>
    <app-nav-item (navigate)="closeSidenav()" *ngIf="loggedIn$ | async" routerLink="/books/find" icon="search" hint="Find your next book!">
      Browse Books
    </app-nav-item>
    <app-nav-item (navigate)="closeSidenav()" *ngIf="!(loggedIn$ | async)">
      Sign In
    </app-nav-item>
    <app-nav-item (navigate)="logout()" *ngIf="loggedIn$ | async">
      Sign Out
    </app-nav-item>
  </app-sidenav>
  <app-toolbar (openMenu)="openSidenav()">
    Book Collection
  </app-toolbar>

  <router-outlet></router-outlet>
</bc-layout>
`
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
