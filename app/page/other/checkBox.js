import React, { Component, } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
const PropTypes = require('prop-types');
import { Icon } from '../mesosphere';

/* eslint global-require: "off"*/
export default class CheckBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked
        };
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange(!this.state.checked);
        }
        this.setState({ checked: !this.state.checked });
    }
    onChangeRight() {
        if (this.props.onPressRight) {
            this.props.onPressRight();
        }
    }

    render() {
        const checked = this.state.checked;
    // const source = checked ? this.props.checkedImage : this.props.uncheckedImage;
        const label = checked ? this.props.label : this.props.uncheckedLabel || this.props.label;
        const labelStyle = checked ? this.props.labelStyle : this.props.uncheckedLabelStyle || this.props.labelStyle;

        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.leftContainer}
              onPress={this.onChange.bind(this)}
              activeOpacity={this.props.activeOpacity}
            >
              {
               checked ? <Image 
                            source={require('../../assets/images/center/checked.webp')}
                            style={{ resizeMode: 'contain', height: 15 }}
                        />:
                        <Image 
                            source={require('../../assets/images/center/unchecked.webp')}
                            style={{ resizeMode: 'contain', height: 15 }}
                        />
              }
              <Text style={[styles.label, labelStyle]}>{label}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onChangeRight.bind(this)}
              activeOpacity={this.props.activeOpacity}
              underlayColor={this.props.underlayColor}
            >
              <Text style={[{ color: '#fff', fontSize: 12, textDecorationLine: 'underline' }, this.props.underlayColor]}>{this.props.textRight}</Text>
            </TouchableOpacity>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    // marginBottom: 5,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 15,
        height: 15,
        marginRight: 5
    },
    labelContainer: {
        marginLeft: 5,
        marginRight: 10
    },
    label: {
        fontSize: 10,
        color: '#999999'
    }
});

CheckBox.propTypes = {
    label: PropTypes.string,
    uncheckedLabel: PropTypes.string,
    labelStyle: Text.propTypes.style,
    uncheckedLabelStyle: Text.propTypes.style,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    activeOpacity: TouchableOpacity.propTypes.activeOpacity,
};

CheckBox.defaultProps = {
    label: '',
    uncheckedLabel: '',
    checked: false,
    underlayColor: 'white',
    activeOpacity: 0.8,
};
