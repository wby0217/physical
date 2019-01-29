// 赛事头部title

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Icons } from '../../mesosphere';

class NavRight extends PureComponent {
    static defaultProps = {
        orderPress: () => {},
        screenPress: () => {}
    }
    render () {
        const { orderPress, screenPress } = this.props;
        return (
            <View style={{ flexDirection: 'row', }}> 
                  <TouchableOpacity
                    ref={ref => this.button = ref}
                    style={[styles.rightButtonView, { marginLeft: 0, padding: 5 }]}
                    onPress={orderPress.bind(this, this.button)}
                  >
                    <Icons name="icon-simple-refresh" color="#fff" size={20} />
                  </TouchableOpacity>      
                  <TouchableOpacity
                    style={[styles.rightButtonView, { marginLeft: 2, padding: 5 }]}
                    onPress={screenPress}
                  >
                    <Icons name="icon-more-list" color="#fff" size={20} />
                  </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rightButtonView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default NavRight;