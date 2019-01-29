// 公司网银账号列表

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import service from '../../../../service';
import { OverlaySpinner } from '../../../../component/tips';
import stylesConfig from '../../../../assets/styles';
import { Header } from '../../../mesosphere';

const { width } = Dimensions.get('window');
export default class RecipientAccount extends Component {
    static navigationOptions = ({ navigation }) => {
        return ({
            title: '平台收款'
        })
    };
    constructor(props) {
        super(props);
        this.state = {
            bankCardList: [],
            selectedAccount: {},
            isConnecting: true,
            isAllowNext: false
        };
        this.onSelectedAccount = this.onSelectedAccount.bind(this);
        this.toggleSpinner = this.toggleSpinner.bind(this);
    }
    toggleSpinner (status) {
        this.setState({
            isConnecting: status || !this.state.isConnecting
        })
    }
    componentDidMount() {
        this.toggleSpinner(true);
        const { params } = this.props.navigation.state;
        this.setState({
            bankCardList: [params.rechargeType],
            isConnecting: false,
            selectedAccount: params.rechargeType,
            isAllowNext: true
        })
    }
    onSelectedAccount (selectedAccount) {
        this.setState({selectedAccount});
    }

    render() {
        const { bankCardList, isConnecting, selectedAccount, isAllowNext } = this.state;
        const { navigate, state } = this.props.navigation;
        const { amount } = state.params;
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    headerTitle="平台收款"
                />
                <View style={styles.headerTitle}>
                    <Text style={{ color: '#17A84B' }}>1 选择存款账户</Text>
                    <Icon name="angle-right" color="#CFCFCF" size={24} />
                    <Text>2 填写信息</Text>
                    <Icon name="angle-right" color="#CFCFCF" size={24} />
                    <Text>3 核对信息</Text>
                </View>
                <ScrollView>
                    {!!bankCardList && bankCardList.map((item, index) => {
                        return (
                            <TouchableOpacity style={styles.bankListItem} key={index}
                                              onPress={() => this.onSelectedAccount(item)}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    {/*<Icon name="circle" size={24} color="#F5F5F5" />*/}
                                    {selectedAccount.id === item.id ?
                                        <Icon name="check-circle" size={24}  color="#17A84B" />
                                        :
                                        <Icon name="circle" size={24} color="#DFDFE9" />
                                    }
                                </View>
                                <View style={{ flexDirection: 'column', flex: 5, paddingHorizontal: 10 }}>
                                    <View style={{ flexDirection: 'row', height: 36, alignItems: 'center' }}>
                                        <Image source={item.image? { uri: item.image }:
                                            require('../../../../assets/images/icon_bank.png')}
                                            style={{ width: 25, height: 25, resizeMode: 'contain', marginRight: 10}}
                                        />
                                        <Text>{item.bankName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', height: 24, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Text>{item.account.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ")}</Text>
                                        <Text style={{ color: '#333' }}>{item.userName}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                    <View style={styles.nextStep}>
                        <TouchableOpacity
                            style={[styles.nextStepInner,
                                { backgroundColor: isAllowNext ? stylesConfig.activeBtn.bg : stylesConfig.disableBtn.bg } ]}
                            onPress={() => {
                                if(!selectedAccount) return;
                                navigate('RechargeReceiptsBill', { selectedAccount: selectedAccount, amount})
                            }}
                            activeOpacity={isAllowNext ? 0.5 : 1}
                        >
                            <Text style={[styles.nextStepTxt, isAllowNext ? {color: '#fff'} : null]}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <OverlaySpinner visible={isConnecting}/>
            </View>
        )
    }
}
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
    bankListItem: {
        backgroundColor: '#fff',
        marginTop: 10,
        flexDirection: 'row',
        height: 60
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
        backgroundColor: '#DFDFE9',
        borderRadius: 5,
    },
    nextStepTxt: {
        color: '#9898A8',
        fontWeight: 'bold',
        fontSize: 16,
    },
})