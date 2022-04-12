import axios from 'axios';
import { Dispatch } from 'react';
import { NewUser } from "../../../functions/types/authTypes";

const authApi: string = '/api/auth';

export type Action =
  | {
    type: 'LOADING_USER';
  }
  | {
    type: 'SIGNUP_SUCCESS',
    payload: {
      email: string;
    };
  }
  | {
    type: 'SIGNUP_FAILURE'
  }
;

export const signup = async (dispatch: Dispatch<Action>, body: NewUser) => {
  try {
    const res = await axios.post(`${authApi}/signup`, body);

    dispatch({
      type: 'SIGNUP_SUCCESS',
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
    })
  }
}
