/* @flow */
export {default as reducer} from './reducer';
export {default as createMiddleware} from './createMiddleware';
export {navigate} from './action';
export {
  getWaygate,
  getPath,
  getQueryString,
  getPathname,
  getQuery,
  isActive,
} from './selector';
export {default as Match} from './Match';
export {default as Switch} from './Switch';
