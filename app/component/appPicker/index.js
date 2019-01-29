import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Button,
    PickerIOS,
    Platform,
    DatePickerIOS,
    TouchableOpacity,
} from 'react-native';

import PickerAndroid from './pickerAndroid';
const { width, height } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
const Picker = isIos ? PickerIOS : PickerAndroid;

export default class AppPicker extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedId: this.props.selectedId || 0
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.closePicker = this.closePicker.bind(this);
    };
    onValueChange (value) {
        this.setState({
            selectedId: value
        })
    };
    closePicker () {
        this.props.onCloseHandle && this.props.onCloseHandle(this.state.selectedId);
    };
    render () {
        const {selectedId } = this.state;
        const {list, label, listItemLabel, listItemValue} = this.props;
        if ( !this.props.isOpen ) return <View />;
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <View style={styles.pickerTopBox}>
                    <View  style={{flex: 3, alignItems: 'flex-start'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16, paddingLeft: 10}}>{label}</Text>
                    </View>
                    <TouchableOpacity onPress={this.closePicker} style={styles.confirmBtn}>
                        <Text style={styles.confirmText}>确定</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.pickerBox}>
                    <Picker style={styles.lotteryPicker}
                            selectedValue={selectedId} onValueChange={this.onValueChange}>
                        {!!list.length && list.map((item, index) => {
                           return <Picker.Item label={ item[listItemLabel]}
                                               value={listItemValue ? item[listItemValue] : index}
                                               key={index} />
                        })}
                    </Picker>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: width,
        height: height,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    confirmBtn: {
        paddingHorizontal: 10,
    },
    confirmText: {
        color: '#17A84B',
        fontSize: 16
    },
    pickerBox: {
        width: width,
        height: 280,
        backgroundColor:'#FFF',
    },
    pickerTopBox: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 40,
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})