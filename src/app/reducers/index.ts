import { ActionReducerMap, ActionReducer, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment.prod';
import * as fromLayout from '../core/reducers/layout.reducer';
import * as fromAuth from '../auth/reducers/auth.reducer';

export interface State {
  router: fromRouter.RouterReducerState;
  layout: fromLayout.State;
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer,
  layout: fromLayout.reducer,
  auth: fromAuth.reducer
};

// log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: any): any => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

export const getLayoutState = createFeatureSelector<State, fromLayout.State>(
  'layout'
);

export const getShowSidenav = createSelector(
  getLayoutState,
  fromLayout.getShowSidenav
);

export const getAuthState = createFeatureSelector<State, fromAuth.State>(
  'auth'
);

export const isAuthenticated = createSelector(
  getAuthState,
  fromAuth.isAuthenticated
);
