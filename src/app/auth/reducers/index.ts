import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from './auth.reducer';
import * as fromRoot from '../../reducers';
import * as actions from '../actions/auth.actions';

export interface AuthState {
  status: fromAuth.State;
}

export interface State extends fromRoot.State {
  auth: fromAuth.State;
}

export const reducers: ActionReducerMap<AuthState, actions.Actions> = {
  status: fromAuth.reducer
};

export const selectAuthState = createFeatureSelector<State, AuthState>('auth');
export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);

export const getUser = createSelector(selectAuthStatusState, fromAuth.getAuthenticatedUser);
export const getIsAuthenticated = createSelector(selectAuthStatusState, fromAuth.isAuthenticated);
export const getIsLoading = createSelector(selectAuthStatusState, fromAuth.isLoading);