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
    Linking,
    Platform,
    Button,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { OverlaySpinner } from '../../../../component/tips';
// import AppButton from '../../../component/appButton';
// import AppButton from '../../../component/appButton';
import service from '../../../../service';
import stylesConfig from '../../../../assets/styles';
import { showToast, ErrorHandle, Header } from '../../../mesosphere';

const { width } = Dimensions.get('window');
export default class SubmitPayInfo extends Component {
    constructor(props) {
        super(props);
        this.rechargeInfo = props.params.rechargeInfo;
        this.payAccount = props.params.payAccount;
        this.state = {
            isConnecting: false,
            isCanSubmit: false,
            userName: '',
            amount: this.rechargeInfo.amount.toString(),
            date: '',
            account: '',

        };
        this.onButtonPress = this.onButtonPress.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
        this.getDate = this.getDate.bind(this);
        this.navigate = props.navigation.navigate;
    }
    getDate(date) {
        this.setState({
            date: date
        }, () => this.setButtonStatus());

    }
    toggleSpinner (status) {
        this.setState({
            isConnecting: status !== undefined ? status : !this.state.isConnecting
        });
    };
    onButtonPress() {
        const { navigation } = this.props;
        const data = {
            amount: this.state.amount,              //充值金额
            rechargeDate: this.state.date,          //入款日期
            remark: this.state.account,             //账户
            rechargeAccountId: this.payAccount.payAccountId,//公司入款账户ID
        };
        this.toggleSpinner(true);
        service.submitFriendPay(data).then(res => {
            this.toggleSpinner(false);
            showToast(res.message, { onHide: () => {
                navigation.goBack(navigation.state.key)
            }})
        }).catch(err => {
            this.toggleSpinner(false);
            ErrorHandle(err);
        })
    }
    setButtonStatus () {
        this.setState({
            isCanSubmit: ( !!this.state.amount && !!this.state.date && !!this.state.account)
        })
    };
    render () {
        const { isConnecting, isCanSubmit } = this.state;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.wrap}>
                    <Text style={styles.label}>充值金额：</Text>
                    <TextInput
                        style={styles.form}
                        placeholder = '请输入充值金额'
                        value = {this.state.amount}
                        autoCapitalize={"none"}
                        keyboardType={"numeric"}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            this.setState({amount:text}, () => this.setButtonStatus());
                        }}
                    />
                </View>
                <View style={styles.wrap}>
                    <Text style={styles.label}>存入时间：</Text>
                    <DatePicker
                        style={styles.form}
                        mode="datetime"
                        format="YYYY-MM-DD HH:mm"
                        customStyles={{
                            dateIcon: { display: 'none' },
                            dateInput: { borderWidth: 0,height:30,position: 'absolute',top:-4,left:0}
                        }}
                        onDateChange={this.getDate}
                        placeholder="请输入存入时间"
                        date= {this.state.date}
                    />
                </View>
                <View style={styles.wrap}>
                    <Text style={styles.label}>{this.rechargeInfo.shortName}账号：</Text>
                    <TextInput
                        style={styles.form}
                        placeholder="请输入您的账号"
                        autoCapitalize={"none"}
                        value = {this.state.account}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            this.setState({account:text}, () => this.setButtonStatus())
                        }}
                    />
                </View>
                <View style={styles.btnWrap}>
                    <TouchableOpacity
                        style={[styles.nextStepInner,
                            { backgroundColor: isCanSubmit ? stylesConfig.activeBtn.bg : stylesConfig.disableBtn.bg } ]}
                        onPress={() => {isCanSubmit && this.onButtonPress()}}
                        activeOpacity={isCanSubmit ? 0.5 : 1}>
                        <Text style={[styles.nextStepTxt, isCanSubmit ? {color: '#fff'} : null]}>立即提单</Text>
                    </TouchableOpacity>
                </View>
                <OverlaySpinner visible= {isConnecting}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop:30,
        // borderTopWidth: StyleSheet.hairlineWidth,
        // borderColor: '#E5E5E5'
    },
    wrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
    },
    btnWrap: {
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
        backgroundColor: '#DFDFE9',
        borderRadius: 5,
    },
    nextStepTxt: {
        color: '#9898A8',
        fontWeight: 'bold',
        fontSize: 16,
    },
    label:{
        flex: 2,
    },
    form: {
        flex: 5,
        height: 34,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 3,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        overflow: 'hidden'
    },
    button:{
        flex: 1,
    }
});