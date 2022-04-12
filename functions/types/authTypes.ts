export interface NewUser {
  email: string;
  username: string;
  password: string;
  verifiedPassword: string;
};
export interface LoginUser {
  email: string;
  password: string;
}
export interface AuthenticatedUser {
  username: string;
}

export type AuthAction = 
  | { type: 'SIGNUP_SUCCESS'; payload: string; }
  | { type: 'SIGNUP_FAILURE'; payload: object[] };

export interface IAuthState {
  loading: boolean;
  token: string | null;
  isAuthenticated: boolean;
  errors: object[] | string;
}