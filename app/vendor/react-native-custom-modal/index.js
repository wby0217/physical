'use strict';

import React, { Component } from 'react';
var ReactNative = require('react-native');
var Button = require('./button');
var FadeInView = require('./fade_in_view');
var { Modal, StyleSheet, TouchableOpacity, View, Dimensions } = ReactNative;

var window = Dimensions.get('window');

export default class ActionModal extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FadeInView
        style={[this.props.styleModal]}
        visible={this.props.modalVisible}
        backgroundColor={this.props.backgroundColor}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={this.props.onCancel}
          >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.container} onPress={this.props.onCancel}></TouchableOpacity>
            {this.props.children}
            {
              !this.props.hasOwnProperty('showBtn') || this.props.showBtn ?
              <Button btnStyle={this.props.btnStyle} onPress={this.props.onCancel} text={this.props.buttonText || "Cancel"} />
              : null
            }

          </View>
        </Modal>
      </FadeInView>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: window.width,
  },
  modalContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});

module.exports = ActionModal;
