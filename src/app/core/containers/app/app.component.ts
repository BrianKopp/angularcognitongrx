import { getAuthenticatedUser } from '../../../auth/reducers/auth.reducer';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../../reducers';
import * as fromAuth from '../../../auth/reducers/auth.reducer';
import * as layoutActions from '../../actions/layout.actions';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showSidenav$: Observable<boolean>;
  loggedIn$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
    this.loggedIn$ = this.store.pipe(select(fromAuth.isAuthenticated));
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
