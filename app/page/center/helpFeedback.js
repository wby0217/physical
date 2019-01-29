// 帮助与反馈

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Linking,
    Keyboard,
    TextInput,
} from 'react-native';
import HTML from 'react-native-render-html';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { service, ErrorHandle, Action, constants, showToast, Icons, Header, stylesGlobal } from '../mesosphere';
import staticData from '../../config/data';
import Accordion from '../../component/Accordion';

const { width } = Dimensions.get('window');
export default class HelpFeedback extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
        })
    }
    constructor (props) {
        super(props)
        this.state = {
            tel: 'tel:10086',
            isValid: false,
            feedbackText: '',
            contact: '',
            helpList: []
        }
    }
    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({ screenHandle: this.screenHandle });
    }
    componentDidMount() {
        this.getHelpList();
    }
    screenHandle = () => {
        const { navigation } = this.props;
        navigation.navigate('ContactUs');
    }
    getHelpList = () => {
        service.getHelpListService({ count: 20 })
        .then(res => {
            this.setState({ helpList: res.data });
        })
        .catch(err => {
            ErrorHandle(err);
        })
    }
    toSubmit = () => {
        const { feedbackText, contact } = this.state;
        const { navigation } = this.props;
        service.feedbackService({ content: feedbackText, contact })
        .then(res => {
            showToast('提交成功!', { onHidden: () => {
                navigation.goBack();
            }})
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    headerRight = () => {
        return (
            <TouchableOpacity
                onPress={this.screenHandle}
            >
                <Icons name="icon-customer-service" color="#fff" size={24} />
            </TouchableOpacity>
        )
    }
    render() {
        const { isValid, feedbackText, helpList } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle='帮助与反馈'
                    navigation = {navigation}
                    headerRight ={ this.headerRight }
                />
                <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: '#F5F5F9' }}>
                    { helpList.length > 0 ?
                        <View>
                            <View style={{ height: 35, justifyContent: 'center', paddingLeft: 10, borderBottomColor: '#E5E5E5', borderBottomWidth: StyleSheet.hairlineWidth }}>
                                <Text>常见问题</Text>
                            </View>
                            {
                                helpList.map((item, index) =>
                                    <Accordion key={index} title={item.title} collapsed={true} titleColor='#666' >
                                        <View style={{ marginTop: 5, padding: 10, backgroundColor:'#F5F5F9' }}>
                                            <HTML
                                                html={item.content}
                                                imagesMaxWidth={width}
                                                ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                                            />
                                    </View>
                                    </Accordion>
                                )
                            }
                        </View> : null}
                    <View style={styles.captionView}>
                        <Text>主人,何事让您如此心烦?</Text>
                    </View>
                    <View style={styles.feedBackTextarea}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            onSubmitEditing={Keyboard.dismiss}
                            multiline={true}
                            placeholder="请简单描述情况,微臣好尽快为您分忧～"
                            onChangeText={(text) => {
                                this.setState({
                                    feedbackText: text
                                })
                            }}
                            onBlur={() => {
                                if(feedbackText.length > 1) {
                                    this.setState({
                                        isValid: true
                                    })
                                } else {
                                    this.setState({
                                        isValid: false
                                    })
                                }
                            }}
                            style={[styles.inputItem]}
                        />
                    </View>
                    <View style={styles.captionView}>
                        <Text>主人,您的联系方式是?</Text>
                    </View>
                    <View style={{ height: 40 }}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            onSubmitEditing={Keyboard.dismiss}
                            multiline={false}
                            placeholder="邮箱／手机号／QQ (选填)"
                            onChangeText={(text) => {
                                this.setState({
                                    contact: text
                                })
                            }}
                            style={[styles.inputItem]}
                        />
                    </View>
                    <View style={styles.submitBtnWrap}>
                        <TouchableOpacity
                            style={[styles.feedbackBtn, !isValid ? {backgroundColor: stylesGlobal.disableBtn.bg } : null]}
                            activeOpacity={ !isValid ? 1 : 0.5}
                            onPress={isValid ? this.toSubmit : null}>
                            <Text style={[styles.feedbackBtnText, !isValid ? {color: stylesGlobal.disableBtn.txtColor} : null]}>一键反馈</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    p: {
        lineHeight: 24,
        paddingHorizontal: 10
    },
    headerRightBtn: {
        padding: 10
    },
    feedBackTextarea: {
        height: 90
    },
    inputItem: {
        marginTop: 2,
        flex: 1,
        borderColor: '#E5E5E5',
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 13,
    },
    textInput: {
        height: 40
    },
    captionView: {
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    submitBtnWrap: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 40,
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
    }
})