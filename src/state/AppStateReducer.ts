import { Action } from './user/Actions';

export type User = {
  username: string;
  token: string;
};

export type AppState = {
  user: User;
};

export const appStateReducer = (
  draft: AppState,
  action: Action
): AppState | void => {
  switch (action.type) {
    case 'SIGNUP_SUCCESS':
      console.log(draft);
      return draft;
    default:
      throw new Error('Invalid action type')
  }
}