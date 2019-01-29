// 待开奖

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Icon, service, ErrorHandle, Action, constants } from '../mesosphere';
import FlatListView from './flatlistView';

class Wait extends Component {
    constructor(props){
        super(props)
    }
    componentWillReceiveProps(nextProps) {
        const { ballTypeId, saveOrderTypeIndex, period } = this.props;
        if(nextProps.saveOrderTypeIndex !== 2) return;
        if(ballTypeId !== nextProps.ballTypeId) {
            this.flatlistview.clearData();
            this.flatlistview.fetchData({ ballTypeId: nextProps.ballTypeId, period: nextProps.period })
        } else if( nextProps.saveOrderTypeIndex === 2 && saveOrderTypeIndex !== nextProps.saveOrderTypeIndex ) {
            this.flatlistview.clearData();
            this.flatlistview.fetchData({ ballTypeId, period: nextProps.period })
        } else if (nextProps.orderFocusStatus && nextProps.saveOrderTypeIndex === 2) {
            this.flatlistview.fetchData({ ballTypeId, period: nextProps.period });
        } else if (!_.isEqual(nextProps.period, period)) {
            this.flatlistview.clearData();
            this.flatlistview.fetchData({ ballTypeId, period: nextProps.period });
        }
    }
    render () {
        return (
            <View style={{ flex: 1 }}>
                <FlatListView
                    ref = { ref => this.flatlistview = ref}
                    type="wait"
                    {...this.props}
                />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        ballTypeId: state.match.screenByBallType.id,
        saveOrderTypeIndex: state.match.saveOrderTypeIndex.orderTypeIndex,
        orderFocusStatus: state.match.judgeIsOrderFocus.orderFocusStatus,
        period: state.match.orderScreenByPeriod
    }
}

export default connect(mapStateToProps)(Wait);
