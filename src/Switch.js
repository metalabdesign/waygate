/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import {createSelector} from 'reselect';

type Props = {
  children: React$Node,
}
type InnerProps = {
  index: number,
  children: React$Node,
  props: Object,
};
type ChildSelector = (state: any) => ({index: number, props: Object});

const Switch = connect((_, props: Props): ChildSelector => {
  const args = [];
  React.Children.forEach(props.children, (child) => {
    invariant(
      typeof child.type.createMatchSelector === 'function',
      'Children of `Switch` must have a static `createMatchSelector` method.'
    );
    args.push(child.type.createMatchSelector(child.props));
  });
  if (args.length === 0) {
    return () => ({index: -1, props: {}});
  }
  return createSelector(...args, (...children) => {
    for (let i = 0; i < children.length; ++i) {
      if (children[i].matches) {
        return {index: i, props: children[i]};
      }
    }
    return {index: -1};
  });
})(({index, props, children}: InnerProps) => {
  const indexed = React.Children.toArray(children);
  const child = indexed[index] ? indexed[index].props.children : null;
  const result = (typeof child === 'function') ? child(props) : child;
  return result;
});

export default Switch;
