import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

export default class LoadMoreFooter extends PureComponent {
    static defaultProps = {
        isLoadAll: false,
    }
    render() {
        const { isLoadAll, loadStop } = this.props;
        return (
            <View style={styles.footer}>
                {
                    isLoadAll === null ? null : React.isValidElement (isLoadAll) ? isLoadAll : isLoadAll ?
                    <View>
                        <Text style={styles.footerTitle}></Text>
                    </View>
                    :
                    <View style={{ flexDirection: 'row' }} >
                        <ActivityIndicator size="small" color='#666' />
                        <Text style={styles.footerTitle}>加载中...</Text>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: '#666'
    }
})