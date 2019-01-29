// 侧边栏
import React, { Component } from 'react';
import {
    View,
    Modal,
    Dimensions,
    StyleSheet,
    Platform,
    NativeModules,
    Animated,
    TouchableOpacity
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

const { width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const topVal = isIOS? isIPhoneX ? 74 : 64 : 54;
export default class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }
    modalSwitchHanlder = (status) => {
        this.setState({
            visible: _.isBoolean(status) ? status : !this.state.visible
        })
    }
    render() {
        const { visible } = this.state;
        return (
            <Modal
                transparent={true}
                visible={visible}
            >
                <TouchableOpacity
                    onPress={() => { this.modalSwitchHanlder(false) }}
                    style={{ flex: 1 }}
                    activeOpacity={1}
                >
                    <View
                        style={{ marginTop: topVal, flex: 1 }}
                    >
                        <Animatable.View animation="fadeIn" style={[styles.shade, { opacity: 1 }]} />
                        <Animatable.View
                            style={{ width: width/2, flex: 1, backgroundColor: '#fff', alignSelf: 'flex-end' }}
                            animation={"fadeInRight"}
                            duration={500}
                        >
                            <TouchableOpacity
                                onPress={null}
                                activeOpacity={1}
                                style={{ flex: 1 }}
                            >
                                {this.props.children}
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    shade: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0.5,0.5,0.5,0.6)'
    },
})