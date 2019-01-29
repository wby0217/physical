// 首页和登录页弹窗
import React, { Component } from 'react';
import { 
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import HTML from 'react-native-render-html';
import { Icons } from '../customIcons';

const { width, height } = Dimensions.get('window');
export default class IndexPopup extends Component {
    static defaultProps = {
        onClose: () => {},
        isVisible: false
    }
    constructor(props) {
        super(props)
    }
    render() {
        const { onClose, isVisible, data, navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                {
                    data && data.format ?
                    data.format === 'text' ?
                        <Modal
                            isVisible={ isVisible }
                            backdropOpacity={0.3}
                        >
                            <View style={{ backgroundColor: '#fff', height: 300, alignItems: 'center', marginHorizontal: 20 }}>
                                <View style={{ height: 30, alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{data.name}</Text>
                                </View>
                                <View style={{ height: 210, paddingHorizontal: 10 }}>
                                    <ScrollView>
                                        <HTML
                                            html={data.text}
                                            imagesMaxWidth={width/2}
                                            ignoredStyles={['font-family', 'font-variant-numeric', 'font-weight']}
                                        />
                                    </ScrollView>
                                </View>
                                <TouchableOpacity
                                    style={styles.btnView}
                                    onPress={onClose}
                                >
                                    <Text style={{ color: '#fff' }}>我知道了</Text>
                                </TouchableOpacity>
                            </View>
                            <Image source={require('../../assets/images/icon_popup.png')} style={{ height: 40, resizeMode: 
                                'contain', width: 250, alignSelf: 'center', top: -323 }} />
                        </Modal>
                        :
                        <Modal
                            isVisible={isVisible}
                            backdropOpacity={0.6}
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={data.url ? () => {
                                    onClose(() => {
                                        navigation.navigate('OnlineService', { title: '通知', service: data.url });
                                    });
                                } : null}
                            >
                                {
                                    data.image ?
                                    <Image
                                        source={{ uri: data.image }}
                                        style={{ width: width*0.8, height: height*0.6, resizeMode: 'contain' }}
                                    /> : null
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', top: 20 }}
                                onPress={onClose}
                            >
                                <Icons name="icon-cycle-del" color="#fff" size={24} />
                            </TouchableOpacity>
                        </Modal>
                    :null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    btnView: {
        height: 30,
        backgroundColor: '#36B64C',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 45,
        marginTop: 15
    }
})
