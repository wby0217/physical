// 比赛结果 
import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
export  default class BallTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ballType: [],
            activeIndex: 0,
            contentWidth: 0
        }
        this.eventArr = {};
    }
    componentDidMount() {
        storage.load({
            key: 'sportsTypes'
        })
        .then(res => {
            this.setState({
                ballType: res
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    updateScroll = ({ pageX, pageY }, page) => {
        const { x } = this.eventArr[page];
        const { contentWidth } = this.state;
        const diffVal = contentWidth - width;
        if(x > diffVal) {
            this.scroll.scrollTo({ x: 125 })
        } else {
            this.scroll.scrollTo({ x: 0 })
        }
        console.log(x)
        
    }
    render() {
        const { ballType, activeIndex } = this.state;
        const { onTouch } = this.props;
        return (
            <View style={{ height: 40 }}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.container}
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.setState({contentWidth});
                    }}
                    ref= {ref => this.scroll = ref}
                >
                    {ballType.length ? ballType.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.ballShadeBox}
                                onLayout={(event) => {
                                    const layout = event.nativeEvent.layout;
                                    this.eventArr[index] = { x: layout.x, y: layout.y, width: layout.width, height: layout.height }
                                }}
                                onPress={(evt) => {
                                    this.updateScroll(evt.nativeEvent, index);
                                    this.setState({ activeIndex: index });
                                    onTouch && onTouch(item);
                                }}
                            >   
                                <View style={[ { flex: 1, justifyContent: 'center' }, activeIndex === index ? styles.activeUnderline : null ]}>
                                    <Text style={[{ color: '#333333' }, activeIndex === index ? { color: '#17A84B' } : null]}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }):<View/>}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        height: 40,
    },
    ballShadeBox: {
        paddingHorizontal: 15
    },
    activeUnderline: {
        borderBottomColor: '#17A84B',
        borderBottomWidth: 1,
    }
})