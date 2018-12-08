import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../../reducers';
import * as layoutActions from '../../actions/layout.actions';
import { AuthFacade } from 'src/app/auth/state/auth.facade';

@Component({
  selector: 'app-core',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showSidenav$: Observable<boolean>;
  isLoggedIn$ = this.authFacade.isLoggedIn$;

  constructor(private store: Store<fromRoot.State>, private authFacade: AuthFacade) {
    this.showSidenav$ = this.store.pipe(select(fromRoot.getShowSidenav));
  }

  ngOnInit() {}

  closeSidenav() {
    this.store.dispatch(new layoutActions.CloseSidenav());
  }
  openSidenav() {
    this.store.dispatch(new layoutActions.OpenSidenav());
  }
  logout() {
    this.closeSidenav();
    this.authFacade.logoutUser();
  }
}
