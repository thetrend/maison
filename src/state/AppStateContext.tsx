import { createContext, Dispatch, FC, useContext } from 'react';
import {
  appStateReducer,
  AppState,
  User
} from './AppStateReducer';
import { Action } from './user/Actions';
const appData: AppState = {
  user: {
    username: 'Grace',
    token: 'somestring'
  }
};

type AppStateContextProps = {
  user: User;
  dispatch: Dispatch<Action>
};

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

export const AppStateProvider: FC = ({ children }) => {
  // const [state, dispatch] = useImmerReducer(appStateReducer, appData);

  // const { user } = state;
  // return (
  //   <AppStateContext.Provider
  //     value={{ user, dispatch }}
  //   >
  //     {children}
  //   </AppStateContext.Provider>
  // )
};

export const useAppState = () => {
  return useContext(AppStateContext);
};
