/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import {createSelector} from 'reselect';

import type {ComponentType} from 'react';
type Props = {
  children: React$Node,
  component: ComponentType<*>,
}

const Switch = connect((_, props) => {
  const args = [];
  const children = React.Children.toArray(props.children);
  const Component = props.component;
  React.Children.forEach(props.children, (child) => {
    invariant(
      typeof child.type.createMatchSelector === 'function',
      'Children of `Switch` must have a static `createMatchSelector` method.'
    );
    args.push(child.type.createMatchSelector(child.props));
  });
  if (args.length === 0) {
    return {index: -1};
  }
  return createSelector(...args, (...children) => {
    for (let i = 0; i < children.length; ++i) {
      if (children[i].matches) {
        return {index: i, props: children[i]};
      }
    }
    return {index: -1};
  });
})(({index, props, children}) => {
  const child = children[index] ? children[index].props.children : null;
  const result = (typeof child === 'function') ? child(props) : child;
  return result;
});

export default Switch;
