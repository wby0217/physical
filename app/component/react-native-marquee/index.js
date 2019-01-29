import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    WebView,
    Dimensions,
    Platform
} from 'react-native';
import _ from 'lodash';

const {width,height} = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
export default class Marquee extends Component{
    constructor(props){
        super(props)
    }
    static defaultProps = {
        text: "测试marquee"
    }
    render(){
        const {text,children} = this.props;
        let _html = '';
        if(isIos) {
            _html = `<meta name="format-detection" content="telephone=no,email=no,adress=no"/><marquee scrollamount="4"><div style="white-space: nowrap; color:#666666;font-size:14;position:relative; line-height: 1.6">${children}</div></marquee>`
        } else {
            _html = `<meta name="format-detection" content="telephone=no,email=no,adress=no"/><marquee scrollamount="5"><div style="white-space: nowrap; color:#666666;font-size:14px;position:relative; line-height: 1.6; overflow:hidden">${children}</div></marquee>`
        }
        return(
            <WebView
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={false}
                source={{html:_html}}
            />
        )
    }
}
