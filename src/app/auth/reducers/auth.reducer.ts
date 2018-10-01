import { CognitoUser } from "amazon-cognito-identity-js";
import * as actions from '../actions/auth.actions';
import * as fromRoot from '../../reducers';

export interface State {
  LoggedIn: boolean;
  LoggingIn: boolean;
  LoggingOut: boolean;
  CurrentUser: CognitoUser | null;
  AccessToken: string | null;
  IdToken: string | null;
  ErrorMessage: string | null;
}

const initialState: State = {
  LoggedIn: false,
  LoggingIn: false,
  LoggingOut: false,
  CurrentUser: null,
  AccessToken: null,
  IdToken: null,
  ErrorMessage: null
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
        IdToken: sa.payload.idToken,
        ErrorMessage: null
      };
    case actions.LOGIN_USER_ERROR:
      const ea = action as actions.LoginUserErrorAction;
      return {
        ...state,
        LoggingIn: false,
        LoggedIn: false,
        CurrentUser: null,
        AccessToken: null,
        IdToken: null,
        ErrorMessage: ea.payload.error
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
    case actions.SIGNUP_USER_ERROR:
      const a = action as actions.SignupUserErrorAction;
      return {
        ...state,
        ErrorMessage: a.payload.error
      }
    case actions.SIGNUP_USER_SUCCESS:
      return {
        ...state,
        ErrorMessage: null
      }
    default: return state;
  }
}

export interface AuthState extends fromRoot.State {
  auth: State;
}

export const isAuthenticated = (state: AuthState) => state.auth.LoggedIn;
export const getAuthenticatedUser = (state: AuthState) => state.auth.CurrentUser;
export const isLoading = (state: AuthState) => state.auth.LoggingIn || state.auth.LoggingOut;
export const getError = (state: AuthState) => state.auth.ErrorMessage;
