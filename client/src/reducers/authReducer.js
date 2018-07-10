import isEmpty from '../validations/is-empty';

import {LOGIN_LOADING, LOGIN_UNLOADING, SET_CURRENT_USER} from "../actions/types";


const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN_LOADING:
      return {
         ...state,
        loading: true
      };
    case LOGIN_UNLOADING:
      return {
        ...state,
        loading: false
      };
    case SET_CURRENT_USER:
      return {
         ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        loading: false
      };
    default:
      return state;
  }
}