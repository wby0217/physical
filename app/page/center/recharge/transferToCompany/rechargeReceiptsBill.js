// 平台收款填写信息

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import DatePicker from 'react-native-datepicker';
import service from '../../../../service';
import AppPicker from '../../../../component/appPicker';
import { ErrorHandle } from '../../../mesosphere';
import stylesConfig from '../../../../assets/styles'
import moment from 'moment';
import _ from 'lodash';
import { Header } from '../../../mesosphere';

const { width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
class RechargeReceiptsBill extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: '平台收款'
        })
    }
    constructor(props) {
        super(props);
        this.state = {
            bankCardList: [],
            selectedId: '',
            isConnecting: true,
            isOpenAppPicker: false,
            isOpenTypePicker: false,
            rechargeTypeList: [], //存款类型
            selectedRechargeType: {}, //选中的存款类型
            selectedBank: {}, //选中的存款银行
            selectedDate: '',
            userName: '',
            verify: false,
            amount: props.navigation.state.params.amount
        };
        this.formatDate = this.formatDate.bind(this);
        this.closeTypePicker = this.closeTypePicker.bind(this);
        this.closeAppPicker = this.closeAppPicker.bind(this);
    }
    getCompanyRechargeTypeList () {
        service.getCompanyRechargeTypeList().then(res => {
            this.setState({
                rechargeTypeList : res.data
            })
        }).catch(err => {
            ErrorHandle(err)
        })
    }
    componentDidMount() {
        this.getCompanyRechargeTypeList()
    }
    closeAppPicker (idx) {
        const { bankList } = this.props;
        const selectedBank = bankList[idx];
        this.setState({
            isOpenAppPicker: false,
            selectedBank
        }, () => {
            this.verifyForm();
        });
    }
    closeTypePicker (idx) {
        const { rechargeTypeList } = this.state;
        const selectedRechargeType = rechargeTypeList[idx];
        console.log('selected recharge type', selectedRechargeType);
        this.setState({
            isOpenTypePicker: false,
            selectedRechargeType,
        }, () => {
            this.verifyForm();
        })
    }
    formatDate(date) {
        const selectedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
        this.setState({
            selectedDate
        }, () => {
            this.verifyForm();
        });
    }
    toCheckInfo = () => {
        const { navigate, state } = this.props.navigation;
        const {userName, selectedBank, selectedRechargeType, selectedDate, verify } = this.state;
        const { selectedAccount, amount } = state.params;
        if(!verify) return;
        navigate('CheckRechargeInfo',{
            userName,
            amount,
            selectedAccount,
            selectedRechargeType,
            selectedDate,
            selectedBank
        });
    }
    verifyForm = () => {
        const {userName, selectedBank, selectedRechargeType, selectedDate, verify } = this.state;
        if(userName && !_.isEmpty(selectedBank) && !_.isEmpty(selectedRechargeType) && selectedDate ){
            this.setState({
                verify: true
            })
        } else {
            verify && this.setState({
                verify: false
            })
        }
    }
    render() {
        const { amount, isOpenAppPicker, isOpenTypePicker, rechargeTypeList, selectedDate, selectedBank, selectedRechargeType, verify } = this.state;
        const { bankList } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    headerTitle="平台收款"
                />
                <ScrollView>
                    <View style={styles.headerTitle}>
                        <Text style={{ color: '#17A84B' }}>1 选择存款账户</Text>
                        <Icon name="angle-right" color="#CFCFCF" size={24} />
                        <Text style={{ color: '#17A84B' }}>2 填写信息</Text>
                        <Icon name="angle-right" color="#CFCFCF" size={24} />
                        <Text>3 核对信息</Text>
                    </View>
                    <View style={ styles.infoListItem }>
                        <View style={styles.inputRow}>
                            <View style={styles.itemTitle}>
                                <Text>姓名</Text>
                            </View>
                            <TextInput
                                underlineColorAndroid="transparent"
                                placeholderTextColor='#cccccc'
                                placeholder="存款人姓名"
                                onChangeText={ val => {
                                    this.setState({
                                        userName: val
                                    });
                                }}
                                onBlur={() => {
                                    this.verifyForm();
                                }}
                                style={styles.inputItem}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.itemTitle}>
                                <Text>存款金额</Text>
                            </View>
                            <View style={styles.itemText}>
                                <Text>{parseFloat(amount)} 元</Text>
                            </View>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.itemTitle}>
                                <Text>方式</Text>
                            </View>
                            <TouchableOpacity style={styles.itemText}
                                onPress={() => this.setState({isOpenTypePicker: true})}>
                                {!_.isEmpty(selectedRechargeType) ?
                                    <Text style={{ marginRight: 10, color: '#333' }}>{selectedRechargeType.name}</Text>
                                    :
                                    <Text style={{ marginRight: 10, color: '#CCCCCC' }}>选择存款方式</Text>
                                }
                                <Icon name="angle-right" color="#CFCFCF" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.itemTitle}>
                                <Text>银行</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.itemText}
                                onPress={() => {
                                    this.setState({
                                        isOpenAppPicker: true
                                    })
                                }}
                            >
                                {!_.isEmpty(selectedBank) ?
                                    <Text style={{ marginRight: 10, color: '#333' }}>{selectedBank.name}</Text>
                                    :
                                    <Text style={{ marginRight: 10, color: '#CCCCCC' }}>请选择银行</Text>
                                }
                                <Icon name="angle-right" color="#CFCFCF" size={24} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.itemTitle}>
                                <Text>存款时间</Text>
                            </View>
                            <View style={styles.itemText}>
                                <DatePicker
                                    mode="datetime"
                                    format="YYYY-MM-DD HH:mm"
                                    customStyles={{dateIcon: { display: 'none' }, dateInput: { borderWidth: 0}}}
                                    onDateChange={this.formatDate}
                                    placeholder="请选择存款日期"
                                    date= {selectedDate}
                                />
                                <Icon name="angle-right" color="#CFCFCF" size={24} />
                            </View>
                        </View>
                    </View>
                    <View style={styles.nextStep}>
                        <TouchableOpacity style={[styles.nextStepInner,
                                {backgroundColor: verify ? stylesConfig.activeBtn.bg : stylesConfig.disableBtn.bg}]}
                                        onPress={() => this.toCheckInfo()}
                                        activeOpacity={verify ? 0.5 : 1}>
                            <Text style={[styles.nextStepTxt, verify ? {color: '#fff'}: null]}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {bankList.length > 0 ? <AppPicker style={styles.picker}
                           isOpen={isOpenAppPicker}
                           list={bankList}
                           listItemLabel="name"
                           label="请选择银行卡"
                           onCloseHandle={(idx) => this.closeAppPicker(idx)}/> : null}
                {rechargeTypeList.length > 0 ? <AppPicker style={styles.picker}
                           isOpen={isOpenTypePicker}
                           list={rechargeTypeList}
                           listItemLabel="name"
                           label="存款方式"
                           onCloseHandle={(idx) => this.closeTypePicker(idx)}/> : null}
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        saveUpdateUser: state.match.saveUpdateUser,
        bankList: state.common.bankList,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeReceiptsBill);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F9',
        flex: 1
    },
    headerTitle: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    infoListItem: {
        backgroundColor: '#fff',
        marginTop: 10,

    },
    nextStep: {
        marginTop: 50,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextStepInner: {
        flex: 1,
        width: width / 1.08,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: stylesConfig.disableBtn.bg,
        borderRadius: 5,
    },
    nextStepTxt: {
        color: '#9898A8',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputItem: {
        flex: 3,
        padding : 0,
        fontSize: 14,
        textAlign: 'right'
    },
    inputRow: {
        flexDirection: 'row',
        height: 50,
        marginHorizontal: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    picker: {
        position: 'absolute'
    },
    itemTitle: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
    itemText: { flex: 3, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }
});



