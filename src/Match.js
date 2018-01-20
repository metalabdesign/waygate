/* @flow */
import pathToRegexp from 'path-to-regexp';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {getPathname} from './selector';

type MatchesResult = {
  matches: boolean,
};

const createPathMatcher = (
  path: string,
  options = {end: false}
): MatchesResult => {
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

type Props = {
  path: string,
  exact?: boolean,
  children: React$Node,
};

const Match = connect((_, props: Props) => {
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

Match.createMatchSelector = (props: Props) => {
  return createPathMatcher(
    props.path,
    {end: props.exact || false}
  );
};

export default Match;
