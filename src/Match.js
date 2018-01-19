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
        return {params: result, matches: true, path, options};
      }
      return {matches: false, path, options};
    }
  );
};

type Props = {
  path: string,
  exact?: boolean,
  children: React$Node,
};

type Context = {
  routingPrefix: string,
};

export default class Match extends React.Component<Props> {
  static contextTypes = {
    routingPrefix: PropTypes.string,
  };

  static childContextTypes = {
    routingPrefix: PropTypes.string,
  };

  Wrapper: ComponentType<*> = () => (<div/>);

  constructor(props: Props, context: Context) {
    super(props, context);
    this.setMatcher(props, context);
  }

  getChildContext() {
    const root = this.context.routingPrefix || '';
    return {routingPrefix: root + this.props.path};
  }

  componentWillReceiveProps(nextProps: Props, nextContext: Context) {
    if (
      nextProps.children !== this.props.children ||
      nextContext !== this.context
    ) {
      this.setMatcher(nextProps, nextContext);
    }
  }

  static createMatchSelector(props: Props, context: Context) {
    return createPathMatcher(
      (context.routingPrefix || '') + props.path,
      {end: props.exact || false}
    );
  }

  setMatcher(props: Props, context: Context) {
    const selector = Match.createMatchSelector(props, context);
    const {children} = props;
    this.Wrapper = connect(selector)((props) => {
      if (props.matches) {
        if (typeof children === 'function') {
          return children(props);
        }
        return children;
      }
      return null;
    });
  }

  render() {
    const Wrapper = this.Wrapper;
    return <Wrapper/>;
  }
}
