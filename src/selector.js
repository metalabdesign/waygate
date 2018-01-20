/* @flow */
import {createSelector} from 'reselect';
import qs from 'qs';

export const getWaygate = (state: Object) => {
  return state.waygate;
};

/**
 *
 *
 */
export const getPath = createSelector(getWaygate, (r) => r.path);

/**
 *
 *
 */
export const getQueryString = createSelector(getPath, (r) => {
  const result = /\?([^#]+)/.exec(r);
  if (result) {
    return result[1];
  }
  return '';
});

/**
 *
 *
 */
export const getQuery = createSelector(getQueryString, (s) => {
  return qs.parse(s);
});

/**
 *
 *
 */
export const getPathname = createSelector(getPath, (r) => {
  return /^[^?#]+/.exec(r)[0];
});

type Options = {
  exact?: boolean,
};

/**
 * @param {String} path something
 * @returns {Function} selector
 */
export const isActive = (path: string, {exact}: Options = {}) => createSelector(
  getPathname,
  (pathname) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.substr(0, path.length) === path;
  }
);
