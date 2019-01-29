// 综合过关 右边头部

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import _ from 'lodash';
class ParlayNavRight extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
        };
    }
    render () {
        const { press, title } = this.props;
        return (
            <TouchableOpacity style={styles.container}>
                <Text style={{ color: '#fff', marginLeft: 2 }}>10</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        
    }
})

export default ParlayNavRight;