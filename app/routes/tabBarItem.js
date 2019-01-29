import React, { Component } from 'react';
import {
    Image,
    Animated,
    Easing,
    View,
    Platform
} from 'react-native';
import { connect } from 'react-redux';

const isIos = Platform.OS == 'ios';
class TabBarItem extends Component {
    constructor(props) {
        super(props)
        this.springValue = new Animated.Value(1);
    }
   async componentWillReceiveProps(nextProps) {
        const { focused } = this.props;
        if(nextProps.focused) {
            this.spring();
        }
    }
    spring = () => {
        this.springValue.setValue(0.5)
        Animated.spring(
          this.springValue,
          {
            toValue: 1,
            friction: 1
          }
        ).start();
      }
    render () {
        const { focused, isMember, saveUpdateUser, isLogin } = this.props;
        return (
                <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }]}>
                    <Animated.Image
                        source={ focused ? this.props.selectedImage : this.props.normalImage}
                        style={[{ tintColor:this.props.tintColor, width: 24, height: 24, transform: [{ scale: this.springValue }] }] }
                        resizeMode={Image.resizeMode.contain}
                    />
                    {
                        isLogin && isMember && saveUpdateUser.messageNotReadNum && saveUpdateUser.messageNotReadNum > 0 ?
                            <View style={[{ backgroundColor: '#FF5200', width: 6, height: 6, borderRadius: 5, position: 'absolute', top: 5, right: 0 }, isIos ? null : { right: 5, top: 0 }]}/>
                        : null
                    }
                </View>
            )
    }
}

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        isLogin: state.match.saveUpdateUser.isLogin,
    }
}
export default connect(mapStateToProps)(TabBarItem);