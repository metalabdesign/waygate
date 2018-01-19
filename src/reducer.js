/* @flow */
import {combineReducers} from 'redux';
import type {Action} from './types';

export const path = (state: string = '/', action: Action) => {
  switch (action.type) {
  case '@@waygate/NAVIGATE':
    return action.payload.path;
  default:
    return state;
  }
};

export default combineReducers({
  path,
});
