import React, { Component } from 'react';
import {
    View,
    Text,
    Modal,
    Animated,
    Easing,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules
} from 'react-native';
import { Icon, Icons } from '../customIcons';

const isIOS = Platform.OS === 'ios';
const isIPhoneX = NativeModules.DeviceInfo.isIPhoneX_deprecated;
const topVal = isIOS? isIPhoneX ? 74 : 64 : 54;
export default class DownPopover extends Component {
    static defaultProps = {
        visible: false,
        titleView: null,
        arrow: true,
        showOrHide: () => {},
        shadeStyle: {}
    }
    constructor(props) {
        super(props);
        this.state = {
            fadeInValue: new Animated.Value(0)
        }
        this.showOrHide = this.showOrHide.bind(this);
    }
    componentDidMount() {
        this.showOrHide();
    }
    componentWillReceiveProps(nextProps) {
        const { visible: willVisible } = nextProps;
        if(willVisible != this.props.visible) {
            this.showOrHide(nextProps);
        }
    }
    showOrHide(prop) {
        const { visible } = prop || this.props;
        const commonConfig = {
                    duration: 300,
                    easing: visible ? Easing.out(Easing.back()) : Easing.inOut(Easing.quad),
                }
                Animated.timing(
                    this.state.fadeInValue,
                    {
                        toValue: visible ? 1 : 0,
                        ...commonConfig
                    }
                ).start();
    }
    render() {
        const {showOrHide, children, buttonRect, visible, arrow, containerStyle, shadeStyle} = this.props;
        return(
            <Modal
              transparent
              visible = {visible}
              showOrHide={this.showOrHide}
              onRequestClose={()=>{}}
            >   
                <Animated.View style={[styles.shade, { opacity: this.state.fadeInValue }, shadeStyle]} />
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex:1, marginTop: -8 }}
                    onPress={showOrHide}
                >
                    <View style={{ marginTop:topVal, flex: 1 }}>
                        {arrow ? <View style={[styles.triangle,{left:buttonRect.x}]}><Icons name="icon-top-triangle" color="#ffffff" size={24} /></View> : null}
                        <Animated.View style={[{ position: 'absolute', top: 10, right: 5, backgroundColor: '#fff', opacity: this.state.fadeInValue, }, containerStyle]}>
                            <TouchableOpacity
                                onPress={null}
                                activeOpacity={1}
                                style={{ flex: 1 }}
                            >
                                {children}
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    shade: {
        position: 'absolute',
        top: topVal,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    triangle: {
        backgroundColor:'rgba(0,0,0,0)',
        top:-3,
        width:24,
        height:24,
        position:'absolute',
        right:9
    }
});
