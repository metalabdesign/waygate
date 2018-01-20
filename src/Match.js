/* @flow */
import pathToRegexp from 'path-to-regexp';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {getPathname} from './selector';

type MatchesResult = {
  matches: boolean,
  params?: {[string]: string},
};

type MatchSelector<T> = (state: T) => MatchesResult;

const createPathMatcher = <T>(
  path: string,
  options = {end: false}
): MatchSelector<T> => {
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
  children: React$Node | Function,
};

const createMatchSelector = <T>(props: Props): MatchSelector<T> => {
  return createPathMatcher(
    props.path,
    {end: props.exact || false}
  );
};

const Match = connect((_, props: Props): MatchSelector<*> => {
  return createMatchSelector(props);
})(({children, matches, params}) => {
  if (matches) {
    if (typeof children === 'function') {
      return children(params);
    }
    return children;
  }
  return null;
});

// FIXME: Flow escape hatch.
(Match: any).createMatchSelector = createMatchSelector;

export default Match;
