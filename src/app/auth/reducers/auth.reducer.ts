import { CognitoUser } from "amazon-cognito-identity-js";
import * as actions from '../actions/auth.actions';
import * as fromRoot from '../../reducers';

export interface State {
  Loading: boolean;
  CognitoState: actions.CognitoStates;
  CurrentUser: CognitoUser | null;
  AccessToken: string | null;
  IdToken: string | null;
  ErrorMessage: string | null;
}

const initialState: State = {
  Loading: false,
  CognitoState: actions.CognitoStates.LOGGED_OUT,
  CurrentUser: null,
  AccessToken: null,
  IdToken: null,
  ErrorMessage: null
};

export function reducer(state: State = initialState, action: actions.Actions): State {
  switch(action.type) {
    case actions.AUTH_LOADING:
      return {
        ...state,
        Loading: true
      };
    case actions.AUTH_ERROR:
      const authError = action as actions.AuthErrorAction;
      return {
        ...state,
        ErrorMessage: authError.payload.error,
        Loading: false
      };
    case actions.LOGIN_USER_SUCCESS:
      const sa = action as actions.LoginUserSuccessAction;
      return {
        ...state,
        CognitoState: actions.CognitoStates.LOGGED_IN,
        Loading: false,
        CurrentUser: sa.payload.user,
        AccessToken: sa.payload.accessToken,
        IdToken: sa.payload.idToken,
        ErrorMessage: null
      };
    case actions.LOGOUT_USER_SUCCESS:
      return initialState;
    case actions.CONFIRMATION_REQUIRED:
      const confAction = action as actions.ConfirmationRequiredAction;
      return {
        ...state,
        CognitoState: actions.CognitoStates.CONFIRMATION_REQUIRED,
        Loading: false,
        CurrentUser: confAction.payload.user,
        ErrorMessage: null
      }
    default: return state;
  }
}

export interface AuthState extends fromRoot.State {
  auth: State;
}

export const isAuthenticated = (state: AuthState) => state.auth.CognitoState === actions.CognitoStates.LOGGED_IN;
export const getAuthenticatedUser = (state: AuthState) => {
  if (state.auth.CognitoState === actions.CognitoStates.LOGGED_IN) {
    return state.auth.CurrentUser;
  } else {
    return null;
  }
}
export const getUser = (state: AuthState) => state.auth.CurrentUser;
export const isLoading = (state: AuthState) => state.auth.Loading;
export const getError = (state: AuthState) => state.auth.ErrorMessage;
export const getCognitoState = (state: AuthState) => state.auth.CognitoState;
export const waitingOnConfirmationCode = (state: AuthState) => state.auth.CognitoState === actions.CognitoStates.CONFIRMATION_REQUIRED;
export const passwordResetRequired = (state: AuthState) => state.auth.CognitoState === actions.CognitoStates.NEW_PASSWORD_REQUIRED;