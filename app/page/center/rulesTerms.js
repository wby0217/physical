// 规则与条款

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Nodata, OverlaySpinner } from '../../component/tips';
import { Icon, service, ErrorHandle, Action, constants, Header } from '../mesosphere';
import staticData from '../../config/data';

const { width } = Dimensions.get('window')
export default class RulesTerms extends Component {
    titleBgUrl = require('../../assets/images/center/bg_rulesTermsTitle.webp');
    static navigationOptions = ({ navigation }) => {
        return ({
            header: null,
            headerTitle: '规则与条款',
            headerBackTitle: null
        })
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Header
                    headerTitle="详细设定"
                    navigation = {navigation}
                />
                <ScrollView style={styles.contentContainer}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 0.9 }}
                        locations={[0, 0.3, 1.0]}
                        colors={['#83D74F', '#43BB4D', '#17A84B']} style={styles.linearGradientMain}>

                        <View style={styles.boxWrap}>
                            {
                                staticData.memRulesTerms.length > 0 ? staticData.memRulesTerms.map((items, i) =>
                                    <View key={i} style={styles.boxInner}>
                                        <ImageBackground
                                            style={styles.titleBg}
                                            source={this.titleBgUrl}>
                                            <Text style={styles.titleText}>{items.title}</Text>
                                        </ImageBackground>
                                        <TouchableOpacity key={i} activeOpacity={1} style={styles.rulesBox}>
                                            {
                                                items.content.length > 0 ? items.content.map((con, i) =>
                                                    <Text key={i} style={styles.textCon}>
                                                        {con}
                                                    </Text>
                                                ) : null
                                            }
                                        </TouchableOpacity>
                                    </View>
                                ) : null
                            }
                        </View>
                    </LinearGradient>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    linearGradientMain: {
        flex: 1
    },
    boxWrap: {
        width,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 35
    },
    boxInner: {
        alignItems: 'center',
    },
    rulesBox: {
        width: width / 1.05,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
        paddingTop: 30,
        borderRadius: 10,
        marginTop: 30,
        overflow: 'visible',
    },
    titleText: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        color: '#B07A00',
        fontWeight: 'bold',
        fontSize: 18,
        height: Platform.OS === 'ios' ? 24 : 30,
        letterSpacing: 1,
    },
    titleBg: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 10,
        width: 175,
        height: 35,
        zIndex: 10
    },
    textCon: {
        letterSpacing: 2.5,
        lineHeight: 20,
        color: '#666666'
    }
})