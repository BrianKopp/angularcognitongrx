import * as layout from '../actions/layout.actions';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false
}

export function reducer(
  state: State = initialState,
  action: layout.Actions
): State {
  switch(action.type) {
    case layout.OPEN_SIDENAV: return { showSidenav: true };
    case layout.CLOSE_SIDENAV: return { showSidenav: false };
    default: return state;
  }
}

export const getShowSidenav = (state: State) => state.showSidenav;
