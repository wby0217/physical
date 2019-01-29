import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import codePush from "react-native-code-push";
import { Icons, service, ErrorHandle, Action, constants, cleanCache, showToast, Header, stylesGlobal, UPDATELOG, logoutHandler } from '../mesosphere';
import settingList from './settingList';
import { logout } from '../../service/authService';

const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: true,
            updateInfo: ''
        }
    }
    loginOut = () => {
        const { navigation } = this.props;
        logout()
        .then(() => {
            logoutHandler(navigation);
            navigation.goBack();
        })
    }
    checkVersionHandle() {
        codePush.sync({
            updateDialog: true,
            installMode: codePush.InstallMode.IMMEDIATE
        }, this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this));
    }
    codePushStatusDidChange(status) {
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            // console.log("Checking for updates");
            this.setState({
              updateInfo: '正在检查更新'
            })
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            // console.log("Downloading package.");
            this.setState({
              updateInfo: '正在下载更新包'
            })
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            // console.log("Installing update.");
            this.setState({
              updateInfo: '正在安装'
            })
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            // console.log("Up to date.");
            this.setState({
              updateInfo: `当前是最新版本${UPDATELOG.length > 1 ? UPDATELOG[1].version : UPDATELOG[0].version }`
            })
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            // console.log("Update installed.");
            this.setState({
              updateInfo: '更新完成'
            })
            break;
        }
    }
    codePushDownloadDidProgress(progress) {
        // console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
        this.setState({
          updateInfo: `正在下载新配置${(progress.receivedBytes / progress.totalBytes * 100).toFixed(2)}%`
        })
    }
    render() {
        const { isLogin, navigation } = this.props;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="设置"
                    navigation={navigation}
                />
                {
                    settingList.length ? settingList.map((item, index) => {
                        return (
                            <View key={index}>
                                {
                                    item.title ?
                                    <View style={{ height: 25, paddingHorizontal: 10, justifyContent: 'center' }}>
                                        <Text style={{ color: '#999999', fontSize: 12 }}>{item.title}</Text>
                                    </View> : null
                                }
                                
                                {
                                    item.list.length ? item.list.map((obj, i) => 
                                        <TouchableOpacity
                                            style={styles.listItem}
                                            activeOpacity={0.6}
                                            key={i}
                                            onPress={() => {
                                                if(obj.routeName === 'clearCache') {
                                                    cleanCache().then(() => showToast('清除成功')).catch(() => showToast('清除失败!'))
                                                } else if(obj.routeName === 'checkVersion') {
                                                    this.checkVersionHandle();
                                                } else {
                                                    navigation.navigate(obj.routeName)
                                                }
                                            }}
                                        >
                                            <Text>{obj.name}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: '#666666' }}>{obj.routeName === 'checkVersion' ? this.state.updateInfo : obj.desc}</Text>
                                                <Icons name="icon-right-arrow-normal" color="#D8D8D8" size={16} />
                                            </View>
                                        </TouchableOpacity>
                                    ): <View/>
                                }
                            </View>
                        )
                    }): <View/>
                }
                <TouchableOpacity
                    activeOpacity={isLogin? 0.8: 1}
                    onPress={isLogin?this.loginOut:null}
                    style={[styles.buttonBase, !isLogin ?{ backgroundColor: stylesGlobal.disableBtn.bg }: { backgroundColor: stylesGlobal.activeBtn.bg }]}
                >
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, !isLogin ? {color: stylesGlobal.disableBtn.txtColor}:{color: stylesGlobal.activeBtn.txtColor} ]}>退出</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9'
    },
    listItem: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    buttonBase: {
        height: 35,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 45
    }
})

const mapStateToProps = (state) => {
    return {
        isLogin: state.match.saveUpdateUser.isLogin
    }
}

export default connect(mapStateToProps)(codePush(codePushOptions)(Setting));