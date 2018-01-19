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

export default class Switch extends React.Component<Props, *> {
  Wrapper: ComponentType<*> = () => null;

  constructor(props: Props, context: any) {
    super(props, context);
    this.setWrapperComponent(props, context);
  }

  componentWillReceiveProps(nextProps: Props, nextContext: *) {
    if (
      nextProps.children !== this.props.children ||
      nextContext !== this.context
    ) {
      this.setWrapperComponent(nextProps, nextContext);
    }
  }

  setWrapperComponent(props: Props, context: *) {
    const args = [];
    const children = React.Children.toArray(props.children);
    const Component = props.component;
    React.Children.forEach(props.children, (child) => {
      invariant(
        typeof child.type.createMatchSelector === 'function',
        'Children of `Switch` must have a static `createMatchSelector` method.'
      );
      args.push(child.type.createMatchSelector(child.props, context));
    });
    if (args.length === 0) {
      this.Wrapper = () => null;
      return;
    }
    const selector = createSelector(...args, (...children) => {
      for (let i = 0; i < children.length; ++i) {
        if (children[i].matches) {
          return {index: i, props: children[i]};
        }
      }
      return {index: -1};
    });
    this.Wrapper = connect(selector)(({index, props}) => {
      const child = children[index] ? children[index].props.children : null;
      const result = (typeof child === 'function') ? child(props) : child;
      if (Component) {
        return <Component>{result}</Component>;
      }
      return result;
    });
  }

  render() {
    const Wrapper = this.Wrapper;
    return <Wrapper/>;
  }
}
