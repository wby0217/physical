// 下注成功 提示框
import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { Icons } from '../customIcons';
const { width } = Dimensions.get('window')
export default class Succtips extends Component {
    static defaultProps = {
        isVisible: false,
        backdropOpacity: 0.5,
        animationIn:'zoomInDown',
        animationOut: 'zoomOutUp',
        onModalShow: () => {},
        onModalHide: () => {},
        style: {
            alignItems: 'center'
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            open: props.isVisible
        }
        this.timer = null;
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.isVisible !== nextProps.isVisible) {
            this.setState({ open: nextProps.isVisible })
            if(nextProps.isVisible) {
                this.closeModal();
            } else {
                clearTimeout(this.timer);
            }
        }
    }
    closeModal = () => {
        this.timer = setTimeout(() => {
            this.setState({
                open: false
            })
            clearTimeout(this.timer);
        }, 1200)
    }
    componentWillUnMount() {
        clearTimeout(this.timer);
    }
    render() {
        return(
            <Modal
                {...this.props}
                isVisible={this.state.open}
            >
                <View style={styles.container}>
                    <Icons name="icon-ok" color="#17A84B" size={32} />
                    <Text style={{ color: '#333333', marginTop: 10 }}>下单成功</Text>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#EAEAEA",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        flexDirection: 'column',
        alignItems: 'center', 
        paddingVertical: 20,
        justifyContent: 'space-between',
        width: 200,
    }
});