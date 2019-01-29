// 信息公告

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform
} from 'react-native';
import { Nodata, OverlaySpinner } from '../../component/tips';
import { Icons, service, ErrorHandle, Action, constants, Header } from '../mesosphere';


export default class Information extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
            headerTitle: '信息公告',
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            infoTypes: [],
            noDataStatus: false,
            isConnecting: false,
            refreshing: false
        }
    }
    componentDidMount() {
        this.fetchData();
        this.togglelLoading();
    }
    fetchData = () => {
        service.infoTypesService()
        .then(res => {
            this.togglelLoading();
            if(res.data && res.data.length > 0){
                this.setState({
                    infoTypes: res.data,
                    noDataStatus: false
                })
            } else {
                this.setState({
                    noDataStatus: true
                })
            }
        })
        .catch(err => {
            this.togglelLoading();
            ErrorHandle(err)
        })
    }
    togglelLoading = () => {
        const { isConnecting } = this.state;
        this.setState({
            isConnecting: !isConnecting
        })
    }
    render() {
        const { infoTypes, noDataStatus, isConnecting, refreshing } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="信息公告"
                    navigation = {navigation}
                />
                {
                    infoTypes && infoTypes.length > 0 ? infoTypes.map((item, index) =>
                    <TouchableOpacity
                        style={styles.rowView}
                        key={index}
                        onPress={() => {
                            navigation.navigate('InfomationList', { title: item.typeName, typeId: item.typeId })
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image  source={{ uri: item.typeIcon }} style={{ width: 40, height: 40, resizeMode: 'contain', marginRight: 15 }}/>
                            <Text>{item.typeName}</Text>
                        </View>
                        <View>
                            <Icons name="icon-right-arrow-normal" color="#CFCFCF" size={22}/>
                        </View>
                    </TouchableOpacity>
                    ): null
                }
                {
                    noDataStatus ? <Nodata onRefresh={this.fetchData} refreshing={refreshing}/> : null
                }
                <OverlaySpinner
                    visible= {isConnecting}
                    cancelable= {true}
                    onTouchShade={this.togglelLoading}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth,
        marginBottom: 10
    }
});