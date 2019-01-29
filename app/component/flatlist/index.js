// 封装flatlist
import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import { commonFetch } from '../../service';

export default class FlatListView extends PureComponent {
    static defaultProps = {
        data: [],
        renderItem: () => {},
        ListFooterComponent: () => {},
        onEndReached: () => {},
        onRefresh: () => {},
    }
    render() {
        const { data, renderItem, ListFooterComponent, refreshing, onEndReached, onRefresh } = this.props;
        return (
            <FlatList
                data={data}
                renderItem= {renderItem}
                refreshing= {refreshing}
                onEndReached={onEndReached}
                onEndReachedThreshold={0}
                style={{ flex: 1 }}
                onRefresh = {onRefresh}
            />
        )
    }
}