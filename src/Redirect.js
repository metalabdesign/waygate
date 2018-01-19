/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import {navigate} from './action';

export default connect(null, {navigate})(
  class Redirect extends React.Component<*, *> {
    componentWillMount() {
      this.props.navigate(this.props.to);
    }
    render() {
      return this.props.children;
    }
  }
);
