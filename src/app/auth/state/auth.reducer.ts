import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AuthStates } from '../model/auth-states';
import { AuthActions, AuthActionTypes } from './auth.actions';

export interface AuthState {
  user: CognitoUser | null;
  authDetails: AuthenticationDetails | null;
  errorMessage: string;
  accessToken: string;
  idToken: string;
  isLoading: {
    login: boolean;
    signup: boolean;
    mfa: boolean;
    confirmationCode: boolean;
    logout: boolean;
    newPassword: boolean;
  };
  authState: AuthStates;
}

export const initialState: AuthState = {
  user: null,
  authDetails: null,
  errorMessage: null,
  accessToken: null,
  idToken: null,
  isLoading: {
    login: false,
    signup: false,
    mfa: false,
    confirmationCode: false,
    logout: false,
    newPassword: false
  },
  authState: AuthStates.NOT_LOGGED_IN
};

export function authReducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.CLEAR_AUTH:
      return initialState;
    case AuthActionTypes.SET_TOKENS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        idToken: action.payload.idToken
      };
    case AuthActionTypes.LOGIN_WAITING:
      return {
        ...state,
        user: action.payload.user,
        authDetails: action.payload.authDetails,
        isLoading: {
          ...state.isLoading,
          login: true
        }
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        authDetails: null,
        authState: AuthStates.LOGGED_IN,
        isLoading: {
          ...state.isLoading,
          login: false
        }
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        authDetails: null,
        errorMessage: action.payload.errorMessage,
        isLoading: {
          ...state.isLoading,
          login: false
        }
      };
    case AuthActionTypes.SIGNUP_WAITING:
      return {
        ...state,
        user: action.payload.user,
        authDetails: action.payload.authDetails,
        isLoading: {
          ...state.isLoading,
          signup: false
        }
      };
    case AuthActionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        authDetails: null,
        authState: AuthStates.LOGGED_IN,
        isLoading: {
          ...state.isLoading,
          signup: false
        }
      };
    case AuthActionTypes.SIGNUP_FAILURE:
      return {
        ...state,
        authDetails: null,
        errorMessage: action.payload.errorMessage,
        isLoading: {
          ...state.isLoading,
          signup: false
        }
      };
    case AuthActionTypes.REQUIRE_MFA:
      return {
        ...state,
        authState: AuthStates.REQUIRE_MFA
      };
    case AuthActionTypes.REQUIRE_USER_CONFIRMATION:
      return {
        ...state,
        authState: AuthStates.REQUIRE_CONFIRMATION
      };
    case AuthActionTypes.REQUIRE_NEW_PASSWORD:
      return {
        ...state,
        authState: AuthStates.REQUIRE_NEW_PASSWORD
      };
    case AuthActionTypes.SUBMIT_CONFIRMATION_CODE:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          confirmationCode: true
        }
      };
    case AuthActionTypes.SUBMIT_CONFIRMATION_CODE_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          confirmationCode: false
        }
      };
    case AuthActionTypes.SUBMIT_CONFIRMATION_CODE_FAILURE:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: {
          ...state.isLoading,
          confirmationCode: false
        }
      };
    case AuthActionTypes.SUBMIT_MFA:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          mfa: true
        }
      };
    case AuthActionTypes.SUBMIT_MFA_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          mfa: false
        }
      };
    case AuthActionTypes.SUBMIT_MFA_FAILURE_INVALID_CODE:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: {
          ...state.isLoading,
          mfa: false
        }
      };
    case AuthActionTypes.SUBMIT_NEW_PASSWORD:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          newPassword: true
        }
      };
    case AuthActionTypes.SUBMIT_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          newPassword: false
        }
      };
    case AuthActionTypes.SUBMIT_NEW_PASSWORD_FAILURE:
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
        isLoading: {
          ...state.isLoading,
          newPassword: false
        }
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          logout: true
        }
      };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
