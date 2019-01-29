// 下级开户  邀请下级

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
    FlatList,
    Platform,
    Alert,
    CameraRoll
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import RNFetchBlob from 'react-native-fetch-blob';
import _ from 'lodash';
import { service, ErrorHandle, Action, constants, Header, stylesGlobal, Icons, showToast } from '../../mesosphere';
import { saveUserInfo } from '../../../service/authService';
import Verify from '../../../config/verify';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS != 'ios';
class LowerLevelCreateAccount extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            active: 'createAccount',  // createAccount、generateCode
            data: [
            ],
            isModalVisible: false,
            userName: '',
            qrcode: '',
            createAccoutValid: false
        }
    }
    getCodeList = () => {
        service.getInvitationCodeListService()
        .then(res => {
            this.setState({
                data: res.data
            })
        })
        .catch(ErrorHandle)
    }
    fetchImageBlob = () => {
        return new Promise((resolve, reject) => {
            if(!isAndroid) {
                resolve()
            } else {
                RNFetchBlob
                .config({ fileCache : true })
                .fetch('GET', this.state.qrcode)
                .then(res => {
                    const qrcode = 'file://' + res.path();
                    return resolve(qrcode);
                })
                .catch(reject)
            }
        })
    }
    saveQrCode = () => {
        this.fetchImageBlob()
        .then((qrcode) => {
            CameraRoll.saveToCameraRoll( isAndroid ? qrcode: this.state.qrcode, 'photo')
        })
        .then(() => {
            Alert.alert('保存相册成功!', '',[{ text: '确定' }])
        })
        .catch(() => {
            Alert.alert('提示!', '图片保存失败,您也可以截图保存二维码😯',[{ text: '确定' }])
        })
    }
    renderItem = ({ item, index }) => {
        return (
            <View style={{ paddingHorizontal: 10, backgroundColor: '#fff' }}>
                <View style={[ styles.QRCodeLisRowView ]}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>{item.code}</Text>
                    </View>
                    <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <Text>{item.userCount}</Text>
                    </View>
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center' }}
                        activeOpacity={0.6}
                        onPress={this.showModalHandle.bind(this, item)}
                    >
                        <Text style={styles.codeBtnTxt}>查看二维码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center' }}
                        activeOpacity={0.6}
                        onPress = {this.deleteItem.bind(this, item)}
                    >
                        <Text style={styles.codeBtnTxt}>删除</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    deleteItem = (item) => {
        const { data } = this.state;
        service.deleteInvitationCodeService({ id: item.id })
        .then(async res => {
            const _index = _.findIndex(data, chr => chr.id == item.id);
            data.splice(_index, 1)
            await this.setState({ data });
            showToast('删除成功!')
        })
        .catch(ErrorHandle)
    }
    generateInvitationCodeHandle = () => {
        service.generateInvitationCodeService()
        .then(res => {
            this.state.data.push(res.data)
            this.setState({
                data: this.state.data
            })
        })
        .catch((err) => {
            ErrorHandle(err);
        })
    }
    renderListHeader = () => {
        return (
            <View style={{ paddingHorizontal: 10, backgroundColor: '#fff' }}>
                <View style={[ styles.QRCodeLisRowView ]}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>邀请码</Text>
                    </View>
                    <View style={{ flex: 1.5, alignItems: 'center' }}>
                        <Text>注册人数</Text>
                    </View>
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Text>操作</Text>
                    </View>
                </View>
            </View>
        )
    }
    renderListFoot = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={[ styles.btn, {backgroundColor: stylesGlobal.activeBtn.bg, marginBottom: 15 }]}
                onPress={this.generateInvitationCodeHandle}
            >
                <Text style={[{ color: stylesGlobal.activeBtn.txtColor, fontWeight: 'bold', letterSpacing: 1.2 }]}>生成新的邀请码</Text>
            </TouchableOpacity>
        )
    }
    showModalHandle = ( item ) => {
        this.setState({
            isModalVisible: true,
            qrcode: item.qrcode
        })
    }
    hideModalHandle = () => {
        this.setState({
            isModalVisible: false
        })
    }
    toRegisterHandler = () => {
        const { userName } = this.state;
        const params = {
            terminal: Platform.OS,
            userName
        }
        service.createSubordinateService(params)
        .then(res => {
            Alert.alert('注册成功','',[{text: '确定', onPress: async () => {
                    await this.setState({ userName: '' })
                    this.checkIsValidUserName();
            }}]);
        })
        .catch(ErrorHandle)
    }
    checkIsValidUserName = () => {
        const  { userName } = this.state;
        if(userName && Verify.username.test(userName)) {
            this.setState({ createAccoutValid: true })
        } else {
            this.setState({ createAccoutValid: false })
        }
    }
    render() {
        const { navigation, accountType } = this.props;
        const { active, data, qrcode, createAccoutValid } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="下级开户"
                    navigation={navigation}
                />
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomColor: '#DDDDDD', borderBottomWidth: StyleSheet.hairlineWidth }}>
                    <TouchableOpacity
                        style={[ styles.titleView, { borderRightColor: '#DDDDDD', borderRightWidth: StyleSheet.hairlineWidth } ]}
                        onPress={() => {
                            this.setState({ active: 'createAccount' })
                        }}
                        activeOpacity={1}
                    >
                        <View style={[ active == 'createAccount' ? styles.activeView : null ]}>
                            <Text style={[ active == 'createAccount' ? styles.activeText : null ]}>精准开户</Text>
                        </View>
                        </TouchableOpacity>
                        {
                            !(accountType === 'special') ?
                            <TouchableOpacity
                            style={styles.titleView}
                            onPress={() => {
                            this.setState({ active: 'generateCode' })
                            this.getCodeList();
                            }}
                            activeOpacity={1}
                        >
                            <View style={[ active == 'generateCode' ? styles.activeView : null ]}>
                                <Text style={[ active == 'generateCode' ? styles.activeText : null ]}>生成邀请码</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        null
                    }
                    
                </View>
                {active === 'createAccount' ?
                    <ScrollView>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row', height: 50, borderBottomColor: '#ddd', borderBottomWidth: StyleSheet.hairlineWidth }}>
                                <View style={{ flexDirection: 'row',alignItems: 'center', flex: 3 }}>
                                    <View style={{ width: 20, alignItems: 'center' }}>
                                        <Icons name="icon-hollow-avatar" size={18} color="#333333" />
                                    </View>
                                    <Text style={{ color: '#333333', marginLeft: 5 }}>用户名</Text>
                                </View>
                                <View style={{ justifyContent: 'center', flex: 10 }}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        placeholder="6-16之间由字母/数字/下划线"
                                        placeholderTextColor="#999"
                                        onChangeText={async (userName) => { await this.setState({ userName }); this.checkIsValidUserName(userName)  }}
                                        autoFocus={true}
                                        value={this.state.userName}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', height: 50,  }}>
                                <View style={{ flexDirection: 'row',alignItems: 'center', flex: 3 }}>
                                    <View style={{ width: 20, alignItems: 'center' }}>
                                        <Icons name="icon-simple-lock" size={14} color="#333333" />
                                    </View>
                                    <Text style={{ color: '#333333', marginLeft: 5 }}>密码</Text>
                                </View>
                                <View style={{ justifyContent: 'center', flex: 10 }}>
                                    <Text style={{ color: '#EC0909' }}>初始密码为：a123456</Text>
                                </View>
                            </View>
                        </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[ styles.btn, createAccoutValid ? {backgroundColor: stylesGlobal.activeBtn.bg } : { backgroundColor: stylesGlobal.disableBtn.bg }]}
                        onPress={this.toRegisterHandler}
                        disabled={!createAccoutValid}
                    >
                        <Text style={[{ fontWeight: 'bold', letterSpacing: 1.2 }, createAccoutValid ? { color: stylesGlobal.activeBtn.txtColor } : { color: stylesGlobal.disableBtn.txtColor }]}>立即开户</Text>
                    </TouchableOpacity>
                </ScrollView>
                :
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data}
                        extraData={this.state}
                        renderItem= {this.renderItem}
                        onEndReachedThreshold={1}
                        ListHeaderComponent={this.renderListHeader}
                        ListFooterComponent={this.renderListFoot}
                        style={{ flex: 1, marginTop: 10 }}
                    />
                </View>
                }
                <Modal
                    isVisible={this.state.isModalVisible}
                    style={{ marginHorizontal: 50 }}
                    backdropOpacity={0.6}
                >
                    <View style={{ backgroundColor: '#fff', height: 280, paddingHorizontal: 10, paddingVertical: 20, borderRadius: 10 }}>
                        { qrcode ?
                        <Image
                            source={{ uri: qrcode }}
                            style={{ width: 140, height: 140, alignSelf: 'center', marginVertical: 10 }}
                        /> :
                        <View style={{ width: 140, height: 140, alignSelf: 'center', justifyContent:'center', alignItems: 'center' }}>
                            <Icons name="icon-img-fail" size={62} color="#999" />
                        </View>
                        }
                        
                        <TouchableOpacity
                            style={{ backgroundColor: '#17A84B', width: 160, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 5, alignSelf: 'center' }}
                            onPress={this.saveQrCode}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>保存图片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.hideModalHandle}
                            style={{ alignSelf: 'center',  width: 160, height: 35,  alignItems: 'center', justifyContent: 'center', marginTop: 5 }}
                        >
                            <Text>取消</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    activeView: {
        borderBottomColor: '#17A84B',
        borderBottomWidth: 2,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 15
    },
    activeText: {
        color: '#17A84B',
        fontWeight: 'bold'
    },
    formView: {
        marginTop: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderTopColor: '#DDDDDD',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    btn: {
        width: width*0.8,
        height: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 40
    },
    QRCodeLisRowView: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    codeBtnTxt: {
        color: '#2375D5'
    }
})

const mapStateToProps = (state) => {
    return {
        accountType: state.match.saveAcountType.type
    }
}

export default connect(mapStateToProps)(LowerLevelCreateAccount);