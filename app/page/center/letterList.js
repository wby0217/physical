// 站内信列表
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import _ from 'lodash';
import { service, showToast, Header, LoadMoreFooter } from '../mesosphere';
import { Nodata } from '../../component/tips'

export default class LetterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoadAll: false,
            datalist: [],
            noData: false,
            refreshing: false
        }
        this.pageIndex = 1;
        this.totalPage = 1;
    }
    componentDidMount() {
        this.setState({ isLoadAll: false })
        this.fetchData()
    }
    fetchData = () => {
        const { datalist, refreshing } = this.state;
        if(this.pageIndex > this.totalPage) {
            this.setState({ isLoadAll: true, refreshing: false });
            return;
        }
        service.getMsgListService({ page: this.pageIndex })
        .then(res => {
            if(res.data.totalPage === 1) {
                this.setState({ isLoadAll: true });
            }
            if(res.data && res.data.result.length > 0) {
                this.totalPage = res.data.totalPage;
                this.setState({
                    datalist: refreshing ? res.data.result : datalist.concat(res.data.result),
                    noData: false,
                    refreshing: false
                })
            } else {
                this.setState({
                    noData: true,
                    refreshing: false
                })
            }
        })
        .catch(err => {
            showToast(err);
            this.setState({ refreshing: false });
        })
    }
    removeItem = (id) => {
        const { datalist } = this.state;
        _.remove(datalist, (obj) => obj.messageId == id);
        if(!datalist.length) {
            this.setState({ datalist, noData: true })
        } else {
            this.setState({ datalist })
        }
        service.delMsgService({
            messageId:id
        })
        .then(res => {
            showToast('删除成功!',{
                onHidden: () => {
                    
                }
            })
        })
        .catch(err => {
            showToast(err);
        })
    }
    renderItem = ({ item }) => {
        const swipeoutBtns = [
            {
              text: '删除',
              color: '#fff',
              backgroundColor: '#E14700',
              onPress: () => {
                  this.removeItem(item.messageId);
              }
            }
          ]
        return (
            <Swipeout
                right={swipeoutBtns}
                autoClose
            >
                <TouchableOpacity
                    style={styles.rowView}
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.navigation.navigate('Letter',{ letter: item, backHandler: this.onRefresh, removeItem: this.removeItem });
                    }}
                >
                    <View style={styles.rowTitle}>
                        <View style={{ flex: 7, justifyContent: 'center' }}>
                            <Text style={{ color: '#333' }} numberOfLines={1} >{item.title}</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Text style={{ color: '#999' }} numberOfLines={1} >{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</Text>
                        </View>
                    </View>
                    <View style={styles.rowTitle}>
                        <Text numberOfLines={1} style={{ fontSize: 12, color: '#999' }}>{item.content}</Text>
                        { item.isRead == 'no' ? <View style={{ width: 5, height: 5, backgroundColor: '#FF5100', borderRadius: 2 }}/> : null }
                    </View>
                </TouchableOpacity>
            </Swipeout>
        )
    }
    handleLoadMore = () => {
        this.pageIndex ++;
        this.fetchData();
    }
    renderFooter = () => {
        const { isLoadAll } = this.state;
        return <LoadMoreFooter isLoadAll={isLoadAll} />
    }
    onRefresh = () => {
        this.pageIndex = 1;
        this.setState({
            refreshing: true,
            // datalist: []
        }, () => {
            this.fetchData();
        })
    }
    render() {
        const { navigation } = this.props;
        const { datalist, noData, refreshing } = this.state;
        return (
            <View style={{ flex: 1 }}>
                 <Header
                    headerTitle="站内信"
                    navigation={navigation}
                />
                {
                    noData ?
                    <Nodata onRefresh={this.onRefresh} />
                    :
                    <FlatList
                        data={datalist}
                        renderItem= {this.renderItem}
                        refreshing= {refreshing}
                        onEndReached={this.handleLoadMore}
                        ListFooterComponent = {this.renderFooter}
                        onEndReachedThreshold={0.1}
                        style={{ flex: 1, backgroundColor: '#F5F5F9' }}
                        onRefresh = {this.onRefresh}
                        keyExtractor={(item, index) => {
                            return index;
                        }}
                    />
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    rowView: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    rowTitle: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
