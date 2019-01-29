// 在线客服

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Clipboard,
    Platform,
    Alert,
    CameraRoll
} from 'react-native';
import Modal from 'react-native-modal';
import DropdownAlert from 'react-native-dropdownalert';
import RNFetchBlob from 'react-native-fetch-blob';
import { CachedImage } from "react-native-img-cache";
import ProgressBar from 'react-native-progress/Bar';
import WebPage from '../../component/webPage';
import _ from 'lodash';
import { Icons, service, ErrorHandle, Action, constants, Header, showToast } from '../mesosphere';

const { width } = Dimensions.get('window');
const isAndroid = Platform.OS != 'ios';
export default class ContactUs extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            wechatModal: false,
            qqNumber: '',
            service: '',
            wechatServiceQrcodeUrl: ''
        }
    }
    async componentDidMount() {
        const config = await storage.load({
            key: 'siteConfig'
        })
        if(_.isEmpty(config)) return;
        this.setState({
            qqNumber: config.qqNumber,
            service: config.service,
            wechatServiceQrcodeUrl: config.wechatServiceQrcodeUrl
        });
    }
    showModalHandle = () => {
        this.setState({
            isModalVisible: true,
        })
    }
    hideModalHandle = () => {
        this.setState({
            isModalVisible: false,
            wechatModal: false
        })
    }
    copyHandler = () => {
        Clipboard.setString(this.state.qqNumber);
        this.dropdown.alertWithType('success', '提醒!', '已复制到粘贴板!');
    }
    fetchImageBlob = () => {
        return new Promise((resolve, reject) => {
            if(!isAndroid) {
                resolve()
            } else {
                RNFetchBlob
                .config({ fileCache : true })
                .fetch('GET', this.state.wechatServiceQrcodeUrl)
                .then(res => {
                    const wechatServiceQrcodeUrl = 'file://' + res.path();
                    return resolve(wechatServiceQrcodeUrl);
                })
                .catch(reject)
            }
        })
    }
    saveQrCode = () => {
        this.fetchImageBlob()
        .then((wechatServiceQrcodeUrl) => {
            CameraRoll.saveToCameraRoll( isAndroid ? wechatServiceQrcodeUrl: this.state.wechatServiceQrcodeUrl, 'photo')
        })
        .then(() => {
            Alert.alert('保存相册成功!', '',[{ text: '确定' }])
        })
        .catch(() => {
            Alert.alert('提示!', '图片保存失败,您也可以截图保存二维码😯',[{ text: '确定' }])
        })
    }
    render() {
        const { qqNumber, service, wechatServiceQrcodeUrl } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle='客服'
                    navigation = {navigation}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                            <Image source={require('../../assets/images/icon_talking.png')} style={{ width: width/2, resizeMode: 'contain' }} />
                        </View>
                        <Text style={{ top: -6, fontSize: 12, color: '#999', paddingHorizontal: 5 }}>可选择以下方式联系客服</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
                        <TouchableOpacity
                            style={{ height: 80, justifyContent: 'space-around', alignItems: 'center' }}
                            onPress={() => {
                                navigation.navigate('OnlineService', { service });
                            }}
                        >
                            <Icons name="icon-customer-service" size={48} color="#fed150" />
                            <Text style={{ color: '#333' }}>在线客服</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ height: 80, justifyContent: 'space-around', alignItems: 'center' }}
                            onPress={this.showModalHandle}
                        >
                            <Icons name="icon-qq" size={38} color="#5fa9f0" style={{ top: 4 }} />
                            <Text style={{ top: 4, color: '#333' }}>QQ客服</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ height: 80, justifyContent: 'space-around', alignItems: 'center', top: 4 }}
                            onPress={() => {
                                this.setState({ wechatModal: true });
                            }}
                        >
                            <Icons name="icon-cycle-wechat" size={36} color="#3fca37" />
                            <Text style={{ color: '#333' }}>微信客服</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Modal
                    isVisible={this.state.isModalVisible}
                    style={{ marginHorizontal: 50 }}
                    backdropOpacity={0.6}
                >
                    <View style={{ backgroundColor: '#fff', height: 240, borderRadius: 10 }}>
                        <View style={{ height: 160, backgroundColor: '#17a84b', borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff' }}>QQ客服号码</Text>
                            <Text style={{ color: '#fff', fontWeight: 'bold', marginTop: 30, fontSize: 18 }}>{qqNumber}</Text>
                        </View>
                        <View style={{ height: 80, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#17a84b', width: 160, height: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 10 }}
                                activeOpacity={0.8}
                                onPress={this.copyHandler}
                            >
                                <Text style={{ color: '#fff' }}>复制客服号码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ alignItems: 'center', top: 20 }}
                        onPress={this.hideModalHandle}
                    >
                        <Icons name="icon-cycle-del" color="#fff" size={24} />
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.dropdown = ref} closeInterval={1800} />
                </Modal>
                <Modal
                    isVisible={this.state.wechatModal}
                    style={{ marginHorizontal: 50 }}
                    backdropOpacity={0.6}
                >
                    <View style={{ backgroundColor: '#fff', height: 240, borderRadius: 10 }}>
                        <View style={{ height: 160,  borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <CachedImage
                                source={{ uri: wechatServiceQrcodeUrl }}
                                resizeMode={Image.resizeMode.stretch}
                                style={{ height: 120, width: 120, resizeMode: 'contain' }}
                                indicator={ProgressBar}
                                mutable
                            />
                        </View>
                        <View style={{ height: 80, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ backgroundColor: '#17a84b', width: 160, height: 30, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 10 }}
                                activeOpacity={0.8}
                                onPress={this.saveQrCode}
                            >
                                <Text style={{ color: '#fff' }}>保存二维码</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{ alignItems: 'center', top: 20 }}
                        onPress={this.hideModalHandle}
                    >
                        <Icons name="icon-cycle-del" color="#fff" size={24} />
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.dropdown = ref} closeInterval={1800} />
                </Modal>
            </View>
        )
    }
}