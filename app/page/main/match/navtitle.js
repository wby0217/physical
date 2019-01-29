// 赛事头部title

import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Icons } from '../../mesosphere';
class NavTitle extends PureComponent {
    render () {
        const { press, title } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                ref={ref => this.evenTypeBtn = ref}
                onPress={() => {
                    press(this.evenTypeBtn)
                }}
                style={{
                    alignSelf: 'center'
                }}
            >
                <View style={styles.titleButton}>
                <Text style={{ color: '#fff', fontSize: 18}}>
                     {_.isObject(title) ? title.typeName : title}
                    <Icons name="icon-triangle-bottom" color="#fff" size={16.5} />
                </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    titleButton: {
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingVertical: 4,
    },
})

export default NavTitle;