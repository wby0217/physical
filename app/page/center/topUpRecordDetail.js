// 充值记录详情

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';
import { service, ErrorHandle, Action, constants } from '../mesosphere';

const { width, height } = Dimensions.get('window');
export default class TopUpRecordDetail extends Component {
    static defaultProps = {
        isOpen: false,
        backdropOpacity: 0.7,
        onClosed: () => {},
        backButtonClose: true,
        style: {
            height: 260,
            width: width-40
        }
    }
    render() {
        const { data } = this.props;
        return (
            <Modal {...this.props}>
                <View style={{  }}>
                    <LinearGradient
                        start={{ x: 0.0, y: 0.0 }} end={{ x: 1.0, y: 1.0 }}
                        locations={[0, 0.5, 1.0]}
                        colors={['#D4E530', '#83CE1F', '#35B70E']} style={styles.linearGradient}
                    >
                        <View style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', flex: 1.5 }}>
                            <Text style={{ color: '#fff', fontSize: 35 }}>+{data && data.amount}</Text>
                            <Text style={{ color: '#fff', fontSize: 12, marginBottom: 8 }}> {data && data.typeName}</Text>
                        </View>
                        <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'flex-start' }}>
                            <View style={{ backgroundColor: '#FFF12A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 }}>
                                <Text style={{ color: '#F14C09' }}>{data && constants.topUpStatus[data.status] }</Text>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', padding: 10  }}>
                        <View style={{ flex: 1 }}>
                            <Image source={require('../../assets/images/time_axis_three.png')} style={{ height: 120, resizeMode: 'contain' }} />
                        </View>
                        <View style={{ flex: 12 }}>
                            <View style={styles.rowView}>
                                <Text style={styles.rowText}>交易单号</Text>
                                <Text style={styles.rowText}>{data && data.no}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.rowText}>交易方式</Text>
                                <Text style={styles.rowText}>{data && data.typeName}</Text>
                            </View>
                            <View style={styles.rowView}>
                                <Text style={styles.rowText}>备注</Text>
                                <Text style={styles.rowText}>{data && data.remark}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>)
    }
}

const styles =StyleSheet.create({
    linearGradient: {
        height: 85,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: 10,
        height: 40
    },
    rowText: {
        color: '#666666'
    }
})