import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Linking,
    ActivityIndicator,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modalbox';
import { saveBankList } from "../../../action/common"
import { showToast, ErrorHandle, Header, Icons, service } from '../../mesosphere';
const { width, height } = Dimensions.get('window');

class Recharge extends Component {
    defaultPhoto = require('../../../assets/images/center/headportrait.webp');
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            typeList:[],
            isConnecting: false
        }
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData = () => {
        this.toggleSpinner(true);
        const { accountType } = this.props;
        if( accountType && accountType == 'special' ) {
            const rechargeTypeJson = require('../../../data/get_recharge_type.json');
            this.setState({
                typeList: rechargeTypeJson.data,
                isConnecting: false
            })
        } else {
            service.getRechargeGroupService({
                terminal: Platform.OS
            })
            .then(res => {
                this.setState({
                    typeList: res.data,
                    isConnecting: false
                })
            })
            .catch(err => {
                ErrorHandle(err);
                this.toggleSpinner(false);
            })
        }
    }
    headerRight = () => {
        const { navigation } = this.props;
        return (
            <TouchableOpacity  onPress={() => navigation.navigate('TopUpRecord')}>
                <Text style={styles.headerRightText}>充值明细</Text>
            </TouchableOpacity>
        )
    }
    toggleSpinner (status, callback) {
        this.setState({
            isConnecting: status !== undefined ? status : !this.state.isConnecting
        }, () => {
            callback && callback()
        });
    };
    render() {
        const { navigation, saveUpdateUser } = this.props;
        const { typeList, isConnecting } = this.state;
        return (
            <View style={{ backgroundColor: '#F5F5F9', flex: 1 }}>
                <Header
                    headerTitle="充值类型"
                    navigation={ navigation }
                    headerRight={this.headerRight}
                />
                <View
                    style={styles.headerContainer}
                >
                    <Image
                        resizeMode='contain'
                        source={this.defaultPhoto}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                    />
                    <View style={{ marginLeft: 10, height: 50, justifyContent: 'space-around' }}>
                        <Text>{saveUpdateUser.userName}</Text>
                        <Text style={{ color: '#333' }}>余额:<Text style={{ color: '#EC0909' }}>{saveUpdateUser.accountBalance}</Text>元</Text>
                    </View>
                </View>
                <View style={{ height: 40, justifyContent: 'center', paddingHorizontal: 10 }}>
                    <Text style={{ color: '#666666' }}>请选择充值类型</Text>
                </View>
                <ScrollView>
                    {
                        typeList.length ? typeList.map((item,index) => 
                        <TouchableOpacity
                            style={styles.payTypeListRow}
                            activeOpacity={0.8}
                            key={index}
                            onPress= {() => {
                                navigation.navigate('SellerList', {  groupId: item.groupId });
                                // if(item.merchant && item.merchant.length > 0) {
                                                                   
                                // } else {
                                //     showToast('该渠道暂无可用商户!');
                                // }
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ width: 30, height: 30, resizeMode: 'contain', marginRight: 5 }}
                                />
                                <Text>{item.groupName}</Text>
                            </View>
                            <Icons name="icon-simple-arrow-right" size={22} color="#CFCFCF" />
                        </TouchableOpacity>
                        ): <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, justifyContent: 'center', height: 200 }}>
                                <ActivityIndicator size="small" color='#666' />
                                <Text>加载中...</Text>
                            </View>
                        }
               </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        paddingHorizontal: 10
    },
    payTypeListRow: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CCCCCC'
    },
    headerRightText: {
        color: '#FFF',
        paddingHorizontal: 3
    },
});

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin,
        saveUpdateUser: state.match.saveUpdateUser,
        bankList: state.common.bankList,
        accountType: state.match.saveAcountType.type
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        saveBankList: (item) => dispatch(saveBankList(item))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Recharge);