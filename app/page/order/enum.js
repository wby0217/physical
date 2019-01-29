import React from 'react';
import {
    Text,
    View,
    Image
} from 'react-native';
import { Icons } from '../mesosphere';

export const isDangerous = (type, remark) => {
    switch (type) {
    case 'not':
        return null;
    case 'wait':
        return (
          <Text style={{ color: '#FF8800' }}>
            <Icons name="icon-warn" /> 危险球待确认
          </Text>
        );
    case 'yes':
        return (
          <Text style={{ color: '#62AE00' }}>
            <Icons name="icon-ok" /> 危险球已确认
          </Text>
        );
    case 'no': 
        return (
          <Text style={{ color: '#999' }}>
            <Icons name="icon-warn" /> {remark || '审核未通过'}
          </Text>
        )
    default:
        return null;
    }
};

export const chooseStatus = (status) => {
    switch (status) {
    case 'wait':
        return (
          <View style={{ paddingHorizontal: 10, backgroundColor: '#AFAFAF', borderRadius: 15, paddingVertical: 2 }}>
            <Text style={{ color: '#fff' }}>未开奖</Text>
          </View>
        );
    case 'undistributed':
        return (
          <View style={{ paddingHorizontal: 10, backgroundColor: '#AFAFAF', borderRadius: 15, paddingVertical: 2 }}>
            <Text style={{ color: '#fff' }}>待结算</Text>
          </View>
        );
    case 'win':
        return (
          <Image source={require('../../assets/images/winning.webp')} style={{ position: 'absolute', right: 10, bottom: 10, resizeMode: 'contain', width: 60 }} />
        );
    case 'cancel':
        return (
          <View style={{ paddingHorizontal: 10, borderRadius: 15, paddingVertical: 2, borderWidth: 1, borderColor: '#979797' }}>
            <Text style={{ color: '#666666' }}>已撤单</Text>
          </View>
        );
    case 'lose':
        return (
          <View style={{ paddingHorizontal: 10, borderRadius: 15, paddingVertical: 2, borderWidth: 1, borderColor: '#979797' }}>
            <Text style={{ color: '#666666' }}>未中奖</Text>
          </View>
        );
    case 'back':
        return (
          <View style={{ paddingHorizontal: 10, borderRadius: 15, paddingVertical: 2, borderWidth: 1, borderColor: '#979797' }}>
            <Text style={{ color: '#666666' }}>和局</Text>
          </View>
        );
    case 'abnormal':
        return (
          <View style={{ paddingHorizontal: 10, borderRadius: 15, paddingVertical: 2, borderWidth: 1, borderColor: '#979797' }}>
            <Text style={{ color: '#666666' }}>无效</Text>
          </View>
        );
    default:
        return null;
    }
};
export const calculateResult = () => {
    return {
        win: '赢',
        win_half: '赢一半',
        lose: '输',
        lose_half: '输一半',
        back: '和局',
        wait: '等待结果',
        abnormal: "无效"
    };
};

