import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Collapsible from '../../vendor/react-native-collapsible/Collapsible';
import { Icons } from '../customIcons';

export default class Accordion extends Component{
    constructor(props){
        super(props)
        this.state = {
            collapsed : (typeof props.collapsed == 'boolean')?props.collapsed : false
        }
        this._toggleExpanded = this._toggleExpanded.bind(this);
        this.animatedValue = new Animated.Value(0);
    }
    static defaultProps = {
        title:"标题",
        containerStyle: {},
        titleColor: '#333333',
        iconSelect: false
    }
    componentDidMount() {
        this.animate();
    }
    _toggleExpanded() {
        this.animate();
        this.setState({
            collapsed:!this.state.collapsed
        })
    }
    animate = () => {
        this.animatedValue.setValue(0);
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear
        }).start();
    }
    render(){
        const { containerStyle, titleStyle, title, titleColor, icon, rightText, iconSelect, titleTextColor } = this.props;
        const { collapsed } = this.state;
        const rotate = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: collapsed ? ['0deg', '180deg']:['180deg', '0deg']
         })
        return(
            <View style={ containerStyle }>
                <TouchableOpacity activeOpacity={0.8} onPress={this._toggleExpanded}>
                    <View style={[styles.accordionTitle, titleStyle ]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 4 }}>
                            {
                                icon ? icon : null
                            }
                            <View  style={[{ flex: 7, justifyContent: 'center' }, !icon ? { marginLeft: 10 } : null]}>
                                <Text numberOfLines={1} style={[titleTextColor ? { color: titleTextColor }: null]}>{title}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 3, justifyContent: 'space-between' }}>
                            <View style={{  flex: 7  }}>
                                {
                                    rightText ? rightText : null
                                }
                            </View>
                            <View style={{ flex: 2, alignItems: 'center' }}>
                            {/* {
                                !collapsed ?
                                <Icons name="icon-arrow-bottom-large"  color="#999999" size={14} />
                                :<Icons name="icon-arrow-top-large"  color="#999999" size={14} />
                            } */}
                                <Animated.View
                                    style={{ transform: [{ rotate }] }}
                                >
                                    {
                                        !iconSelect ?
                                        <Icons name="icon-arrow-bottom-large"  color={titleTextColor ? titleTextColor : "#999999"} size={14} />
                                        :<Icons name="icon-arrow-top-large"  color={titleTextColor ? titleTextColor : "#999999"} size={14} />
                                    }
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Collapsible collapsed={collapsed} align="center" >
                    {this.props.children}
                </Collapsible>
            </View>
            )
    }
}
const styles = StyleSheet.create({
    defaultTitle:{
        height:40,
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:10
    },
    accordionTitle: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 5
    },
})