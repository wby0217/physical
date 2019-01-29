import React, { Component } from 'react';
import {StyleSheet,View,TextInput,Text,TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff'
    },
    inputItem: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputItemBorderLeftWidth: {
        borderLeftWidth: 1,
        borderColor: '#ccc',
    },
    iconStyle: {
        width: 16,
        height: 16,
        backgroundColor: '#222',
        borderRadius: 8,
    },
    input: {opacity: 0, position: 'absolute'}
});

export default class passwordInput extends Component{
    constructor(props){
        super(props);
        this.state={
            text: props.password
        };
        this.onPressHandle = this.onPressHandle.bind(this);
    }
    onPressHandle(){
        this.props.onPress && this.props.onPress();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.password !== this.state.text) {
            this.setState({
                text: nextProps.password
            });
            this.props.onChange && this.props.onChange(nextProps.password);
        }
    }
    render(){
        return(
            <TouchableHighlight onPress={() => this.onPressHandle()} activeOpacity={1} underlayColor='transparent'>
                <View style={[styles.container,this.props.style]} >
                    {this.getInputItem()}
                </View>
            </TouchableHighlight>
        )

    }
    getInputItem(){
        let inputItem = [];
        let { text }=this.state;
        const { inputItemStyle, maxLength, iconStyle} = this.props;
        for (let i = 0; i < parseInt(maxLength); i++) {
            inputItem.push(
                <View key={i} style={[styles.inputItem, i !== 0 && styles.inputItemBorderLeftWidth, inputItemStyle]}>
                    {i < text.length ? <View style={[styles.iconStyle, iconStyle]}></View> : null}
                </View>)

        }
        return inputItem;
    }
}
