/* @flow */
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {getPathname} from './selector';

import type {ComponentType} from 'react';

const createPathMatcher = (path, options = {end: false}) => {
  const keys = [];
  const regexp = pathToRegexp(path.replace(/^\/$/, ''), keys, options);
  return createSelector(
    getPathname,
    (p) => {
      const params = regexp.exec(p);
      if (params) {
        const result = {};
        keys.forEach(({name}, i) => {
          result[name] = params[i + 1];
        });
        return {params: result, matches: true, path};
      }
      return {matches: false, path};
    }
  );
};

type MatchesResult = {
  matches: boolean,
};

type Props = {
  path: string,
  exact?: boolean,
  children: React$Node,
} | {
  selector: (Object) => MatchesResult,
  children: React$Node,
};

type Context = {
  routingPrefix: string,
};

const Match = connect((_, props) => {
  return Match.createMatchSelector(props);
})(({children, matches, params}) => {
  if (matches) {
    if (typeof children === 'function') {
      return children(params);
    }
    return children;
  }
  return null;
});

Match.createMatchSelector = (props) => {
  if (props.selector) {
    return props.selector;
  }
  return createPathMatcher(
    props.path,
    {end: props.exact || false}
  );
}

export default Match;
