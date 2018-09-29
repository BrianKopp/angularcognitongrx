import { CognitoUser } from "amazon-cognito-identity-js";
import * as actions from '../actions/auth.actions';


export interface State {
  LoggedIn: boolean;
  LoggingIn: boolean;
  LoggingOut: boolean;
  CurrentUser: CognitoUser | null;
  AccessToken: string | null;
  IdToken: string | null;
}

const initialState: State = {
  LoggedIn: false,
  LoggingIn: false,
  LoggingOut: false,
  CurrentUser: null,
  AccessToken: null,
  IdToken: null
};

export function reducer(state: State = initialState, action: actions.Actions): State {
  switch(action.type) {
    case actions.LOGIN_USER:
      return {...state, LoggingIn: true};
    case actions.LOGIN_USER_SUCCESS:
      const sa = action as actions.LoginUserSuccessAction;
      return {
        ...state,
        LoggingIn: false,
        LoggedIn: true,
        CurrentUser: sa.payload.user,
        AccessToken: sa.payload.accessToken,
        IdToken: sa.payload.idToken
      };
    case actions.LOGIN_USER_ERROR:
      const ea = action as actions.LoginUserErrorAction;
      return {
        ...state,
        LoggingIn: false,
        LoggedIn: false,
        CurrentUser: null,
        AccessToken: null,
        IdToken: null
      };
    case actions.LOGOUT_USER:
      return {
        ...state,
        LoggingOut: true
      };
    case actions.LOGOUT_USER_SUCCESS:
      return {
        ...state,
        LoggedIn: false,
        LoggingOut: false,
        CurrentUser: null,
        AccessToken: null,
        IdToken: null
      }
    case actions.LOGOUT_USER_ERROR:
      return {
        ...state,
        LoggingOut: false
      };
    default: return state;
  }
}

export const isAuthenticated = (state: State) => state.LoggedIn;
export const getAuthenticatedUser = (state: State) => state.CurrentUser;
export const isLoading = (state: State) => state.LoggingIn || state.LoggingOut;
