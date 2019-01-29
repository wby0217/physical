'use strict';

import React, { Component } from 'react';
var ReactNative = require('react-native');
var { Animated, Dimensions, StyleSheet, View } = ReactNative;
var window = Dimensions.get('window');

export default class FadeInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        fadeAnim: new Animated.Value(0),
        visible: props.visible
    };
    this.mounted = false;
  }

  componentDidMount() {
    this._animate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._animate(nextProps);
    !this.mounted && this.setState({
      visible: true
    });
  }

  componentWillUnmount() {
    this._animate(this.props);
    this.state.visible = false;
    this.mounted = true;
  }

  _animate(newProps){
    return Animated.timing(this.state.fadeAnim, {
      toValue: newProps.visible ? 0.2 : 0,
      duration: 300
    }).start(() => {
      if(!newProps.visible) {
        !this.mounted && this.setState({
          visible: false,
        })
      }
    });
  }

  render() {
    return (
      this.state.visible ?
      <Animated.View style={[styles.overlay,
          {opacity: this.state.fadeAnim},
          {backgroundColor: this.props.backgroundColor || '#000' }
        ]}>
        {this.props.children}
      </Animated.View> : null
    );
  }
};

var styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    height: window.height,
    width: window.width
  }
});

module.exports = FadeInView;
