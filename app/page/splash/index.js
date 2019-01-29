// 开场更新页
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    NetInfo
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import codePush from "react-native-code-push";

export default class Splash extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props)
        this.state = {
            updateInfo: '正在加载配置',
            isDestroy: false,
            appConfig: {}
        }
        this.timer = null;
        this.countDownTimer = null;
        this.abortTimer = null;
        this.count = 3;
    }
    async componentDidMount() {
        StatusBar.setBarStyle('dark-content');
        this.checkUpdate();
        try{
            const data = await storage.load({ key: 'siteConfig' });
            this.setState({ appConfig: data });
        }catch(err) {
            console.log(err);
        }
        this.countDown();
        // NetInfo.isConnected.addEventListener(
        //     'connectionChange',
        //     this.handleFirstConnectivityChange
        // );
    }
    handleFirstConnectivityChange = (isConnected) => {
        isConnected ? this.checkUpdate() : this.updateFinish();
        NetInfo.isConnected.removeEventListener(
          'connectionChange',
           this.handleFirstConnectivityChange
        );
    }
    countDown = () => {
        this.countDownTimer = setTimeout(() => {
            this.count --;
            if(this.count < 0) {
                return clearTimeout(this.countDownTimer);
            }
            this.countDown();
        }, 1000);
    }
    codePushDownloadDidProgress(progress) {
        this.setState({
            updateInfo: `正在下载新配置${(parseFloat(progress.receivedBytes) / parseFloat(progress.totalBytes) * 100).toFixed(2)}%`
        })
    }
    codePushStatusDidChange (status) {
        switch(status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ updateInfo: '正在检查新配置' });
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                this.setState({ updateInfo: '正在安装配置内容' });
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({ updateInfo: '将重新打开应用' });
                break;
        }
    }

    checkUpdate = () => {
        this.tempTimer = setTimeout(() => {
            this.updateFinish();
        }, 6000);
        this.fetchAbort()
        .then(update => {
            // clearTimeout(this.tempTimer);
            console.log('codepush update=========',  update);
            // !!this.timer && clearTimeout(this.timer);
            if (!!update) {
                return  codePush.sync({installMode: codePush.InstallMode.IMMEDIATE},
                    this.codePushStatusDidChange.bind(this),
                    this.codePushDownloadDidProgress.bind(this)
                )
            }
        })
        .then(() => codePush.notifyAppReady())
        .then(() =>{
            clearTimeout(this.tempTimer);
            this.setState({updateInfo: '当前是最新配置'}, () => {
                !!this.timer && clearTimeout(this.timer); 
                this.updateFinish();
            })
        })
        .catch(async err => {
            clearTimeout(this.tempTimer);
            console.log('codepush update=========err',  err);
            await this.setState({updateInfo: '当前是最新配置'});
            this.updateFinish();
        });
    }
    fetchAbort = () => {
        let abortFn = null;
        const abortPromise = new Promise((resolve, reject) => {
            abortFn = () => reject(new Error("codepush请求超时"));
            console.log('=======codepush请求超时')
        });
        this.abortTimer = setTimeout(abortFn, 10000);
        return abortablePromise = Promise.race([
            codePush.checkForUpdate,
            abortPromise
        ]);
    }
    updateFinish = () => {
        console.log('=====updateFinish');
        const resetActions = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({
                routeName: 'Main',
                params: { source: 'splash' }
            })]
        });
        this.abortTimer && clearTimeout(this.abortTimer);
        // 闪屏页至少停留3s
        if (this.count > 0) {
            this.timer = setTimeout(() => {
                this.timer && clearTimeout(this.timer);
                this.countDownTimer && clearTimeout(this.countDownTimer);
                this.props.navigation.dispatch(resetActions);
             }, this.count * 1000)
        } else {
            this.timer && clearTimeout(this.timer);
            this.countDownTimer && clearTimeout(this.countDownTimer);
            this.props.navigation.dispatch(resetActions);
        }
    }
    render() {
        const { updateInfo, appConfig } = this.state;
        // const imgObj = appConfig.splash ? { uri: appConfig.splash } : require('../../assets/images/splash_image.png');
        const imgObj = require('../../assets/images/splash_image.png');
        return (
            <ImageBackground style={ styles.container } source={imgObj}>
                <TouchableOpacity
                    style={{ height: 120, justifyContent: 'flex-end', paddingBottom: 20, alignItems: 'center' }}
                    activeOpacity={1}
                    //onPress={this.updateFinish}
                >
                    <Text style={{ backgroundColor: 'transparent',color: '#fff', marginBottom: 4, fontSize: 16 }}>{appConfig.appName ? appConfig.appName : "理性投注，快乐购彩"}</Text>
                    <Text style={{ backgroundColor: 'transparent',color: '#fff', fontSize: 12 }}>{ updateInfo }</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
    componentWillUnmount() {
        !!this.timer && clearTimeout(this.timer);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
})