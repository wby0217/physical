import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import PropTypes from 'prop-types';

export default class OverlaySpinner extends PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired
    }
    static defaultProps = {
        visible: false,
        overlayColor: 'rgba(0, 0, 0, 0.25)',
        cancelable: true,
        color: '#ffffff',
        size: 'large',
        textStyle: {},
        textContent: '',
        onTouchShade: () => {}
    }
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible || false
        }
    }
    render() {
        const { color, size, textStyle, textContent, onTouchShade } = this.props;
        return (
             <Spinner {...this.props}>
                <TouchableOpacity
                    style={styles.background}
                    onPress={onTouchShade}
                >
                    <ActivityIndicator
                    color={color}
                    size={size}
                    style={{ flex: 1 }}
                    />
                    <View style={styles.textContainer}>
                        <Text style={[styles.textContent,textStyle]}>{textContent}</Text>
                    </View>
                </TouchableOpacity>
            </Spinner>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    textContent: {
        top: 80,
        height: 50,
        fontSize: 20,
        fontWeight: 'bold'
    }
})

