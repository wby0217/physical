// 添加银行卡

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
    Linking,
    Keyboard,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modalbox';
import Iconsome from 'react-native-vector-icons/FontAwesome';
import SimpleModal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';
import { OverlaySpinner, Alert } from '../../component/tips';
import { saveBankList } from "../../action/common";
import { service, ErrorHandle, Action, constants, showToast, Icons, Header, stylesGlobal } from '../mesosphere';
const dismissKeyboard = require('dismissKeyboard');

const { width, height } = Dimensions.get('window');
class AddBankCard extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null
        })
    };
    constructor(props) {
        super(props)
        this.state = {
            isValid: false,
            bankList: [],
            isShowBankList: false,
            selectedBank: {},
            bankCard: '',
            modalIsOpen: false,
            bankAddress: '',
            isConnecting: false
        }
        this.routeName = 'MyBankCard';
    }
    componentDidMount () {
        this.getBankCardList();
    }
    getBankCardList = () => {
        const { bankList, saveBankList } = this.props;
        if(!bankList.length) {
            service.getBankListService()
            .then(res => {
                this.setState({
                    bankList: res.data
                })
                saveBankList(res.data)
            })
            .catch(err => {
                ErrorHandle(err);
            })
        } else {
            this.setState({
                bankList: bankList
            })
        }
    }
    renderBankList = (bankList) => {
        return !!bankList && bankList.map((item, index) => {
            return (
                <TouchableOpacity style={styles.bankItem}
                    onPress={this.onPressBankHandle.bind(this, item)}
                    key={index}>
                    <Image style={styles.bankIcon}
                           source={!item.image ? require('../../assets/images/icon_bank.png') : {uri: item.image}} />
                    <Text style={styles.bankName}>{item.name}</Text>
                </TouchableOpacity>
            )
        })
    };
    toggleShowBankList = (status, callback) => {
        dismissKeyboard();
        this.setState ({
            isShowBankList: status ? status : !this.state.isShowBankList
        }, () => {
            callback && callback();
        })
    };
    onPressBankHandle = (item) => {
        this.setState({
            selectedBank: item
        },() => this.endVeviry())
        this.toggleShowBankList();
    }
    endVeviry = () => {
        const { bankCard, selectedBank } = this.state;
        if(bankCard && !_.isEmpty(selectedBank)) {
            this.setState({ isValid: true })
        } else {
            this.setState({ isValid: false })
        }
    }
    toggleOverlay = () => {
        // loading层开关
        this.setState({
            isConnecting: !this.state.isConnecting
        })
    }
    toggleMadalOpen = () => {
        const { modalIsOpen } = this.state;
        this.setState({ modalIsOpen: !modalIsOpen });
    }
    jumpRoute = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        if(params && params.routeName && params.routeName=='withdraw') {
            this.routeName = 'WithDraw';
        } else {
            this.routeName = 'MyBankCard';
        }
        navigation.navigate(this.routeName, { key: params && params.key || navigation.state.key, reloadCardInfo: navigation.state.params && navigation.state.params.reloadCardInfo });
    }
    toSubmit = () => {
        const { selectedBank, bankAddress, bankCard } = this.state;
        const { navigation } = this.props;
        const { params } = navigation.state;
        this.toggleOverlay();
        service.addCardService({
            id: selectedBank.id,
            address: bankAddress,
            cardNumber: bankCard && bankCard.replace(/\s+/g, "")
        })
        .then(res => {
            this.toggleOverlay();
            showToast('银行卡添加成功!',{
                onHidden: this.jumpRoute
            })
        })
        .catch(err => {
            this.toggleOverlay();
            ErrorHandle(err);
        })
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        return (
            <TouchableOpacity
                onPress={() => {
                    if(params && params.key) {
                        navigation.goBack(params.key)
                    } else {
                        navigation.goBack();
                    }
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { isValid, nameText, fundText, fundRepeatText, bankList, isShowBankList, selectedBank, modalIsOpen, isConnecting } = this.state;
        const { saveUpdateUser, navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
                <Header
                    headerTitle='我的银行卡'
                    navigation = {navigation}
                    headerLeft= { this.headerLeft }
                />
                <ScrollView
                     keyboardShouldPersistTaps="handled"
                >
                    <View style={{ height: 30, justifyContent: 'center', paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 12, color: '#999999' }}>为您账户安全，真实姓名要与绑定银行卡姓名一致</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.rowView}>
                            <View style={styles.textView}>
                                <View style={{ flex: 1 }}>
                                    <Text>姓名</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <Text style={{ fontSize: 14 }}>
                                        {saveUpdateUser.realName}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={this.toggleMadalOpen}
                                >
                                    <Icons name="icon-warn-fail" size={22} color="#17A84B" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.textView}>
                                <View style={{ flex: 1 }}>
                                    <Text>卡号</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={Keyboard.dismiss}
                                        multiline={false}
                                        placeholder="请输入银行卡号"
                                        onChangeText={(text) => {
                                            this.setState({
                                                bankCard: text
                                            })
                                        }}
                                        autoFocus={true}
                                        keyboardType="numeric"
                                        onBlur={this.endVeviry}
                                        style={{ fontSize: 14 }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.rowView}>
                            <View style={styles.textView}>
                                <View style={{ flex: 1 }}>
                                    <Text>银行</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ flex: 5, flexDirection: 'row', justifyContent: 'flex-end' }}
                                    onPress={this.toggleShowBankList}
                                >
                                {!_.isEmpty(selectedBank) ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#333' }}>{selectedBank.name}</Text>
                                    <Icons name="icon-right-arrow-normal" color="#D8D8D8" size={16} />
                                </View>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#999' }}>请选择银行</Text>
                                    <Icons name="icon-right-arrow-normal" color="#D8D8D8" size={16} />
                                </View>
                                }
                                    
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.rowView, { borderBottomWidth: 0 }]}>
                            <View style={styles.textView}>
                                <View style={{ flex: 2 }}>
                                    <Text>开户行地址</Text>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        onSubmitEditing={Keyboard.dismiss}
                                        multiline={false}
                                        placeholder="请输入支行名"
                                        onChangeText={(text) => {
                                            this.setState({
                                                bankAddress: text
                                            })
                                        }}
                                        style={{ fontSize: 14 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.submitBtnWrap}>
                        <TouchableOpacity
                            style={[styles.feedbackBtn, !isValid ? {backgroundColor: stylesGlobal.disableBtn.bg } : null]}
                            activeOpacity={ !isValid ? 1 : 0.5}
                            onPress={isValid ? this.toSubmit : null}>
                            <Text style={[styles.feedbackBtnText, !isValid ? {color: stylesGlobal.disableBtn.txtColor} : null]}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                    <Alert ref={view=>this._alert=view}/>
                    <Modal style={styles.bankListModal}
                       position={"bottom"}
                       backdropPressToClose={false}
                       swipeToClose={false}
                       isOpen={isShowBankList}>
                        <View style={styles.modalTitleBar}>
                            <Text style={styles.titleText}>请选择银行</Text>
                            <TouchableOpacity onPress={() => this.toggleShowBankList(false)}>
                                <Iconsome size={16} name="times-circle" color="#999"/>
                            </TouchableOpacity>
                        </View>
                        <ScrollView>{this.renderBankList(bankList)}</ScrollView>
                    </Modal>
                    <SimpleModal
                        isVisible={modalIsOpen}
                        style={styles.modalStyle}
                        backdropOpacity={0.5}
                        animationIn="zoomIn"
                        animationOut="zoomOut"
                    >
                        <View style={{ padding: 15, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 40 }}>
                            <View style={{ height: 24, justifyContent: 'center' }}>
                                <Text>持卡人说明</Text>
                            </View>
                            <View>
                                <Text>为保证账户资金安全,只能绑定认证用户本人的银行卡。</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', height: 30, justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={this.toggleMadalOpen}
                                >
                                    <Text style={{ color: '#EC0909' }} >确认</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SimpleModal>
                <OverlaySpinner
                        visible= {isConnecting}
                        cancelable= {true}
                        onTouchShade={this.toggleOverlay}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightBtn: {
        padding: 10
    },
    inputContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth 
    },
    textView: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    submitBtnWrap: {
        flex: 1,
        alignItems: 'center',
        marginTop: 40,
    },
    feedbackBtn: {
        width: width / 1.1,
        backgroundColor: stylesGlobal.activeBtn.bg,
        borderRadius: 4,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    feedbackBtnText: {
        color: stylesGlobal.activeBtn.txtColor,
        fontWeight: 'bold'
    },
    rowView: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    bankItem: {
        flex: 1,
        flexDirection: 'row',
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },
    bankIcon: {
        width: 30,
        height: 30,
        marginRight:20,
        resizeMode: 'contain'
    },
    modalTitleBar: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },
    bankListModal: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height-200,
    },
    titleText: {
        flex: 10,
        fontSize: 14,
    },
    bankName: {

    },
    modalStyle: {
    }
});

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin,
        saveUpdateUser: state.match.saveUpdateUser,
        bankList: state.common.bankList,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        saveBankList: (item) => dispatch(saveBankList(item))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddBankCard);