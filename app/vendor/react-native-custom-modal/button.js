'use strict'

var React = require('react');
var ReactNative = require('react-native');
var { StyleSheet, Text, TouchableOpacity, View } = ReactNative;
const createReactClass = require('create-react-class');

var Button = createReactClass({
  render: function() {
    return (
      <TouchableOpacity style={[this.props.btnStyle, styles.button]} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  buttonText: {
    color: '#000000',
    alignSelf: 'center',
    fontSize: 14
  },
  button: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

module.exports = Button
