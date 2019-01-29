import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';

const { width } = Dimensions.get('window');
const TooltipMenuItem = ({ engName, pressSelect, seletedItem, name }) => {
    const isSelected = seletedItem.engName === engName;
    return (
            <View style={[styles.container, isSelected ? { borderColor: '#17A84B' } : {}]}>
                <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center' }} onPress={pressSelect}
                >
                    <Text style={isSelected ? { color: '#17A84B' } : { color: '#585858' }}>{name}</Text>
                </TouchableOpacity>
                {
                isSelected ? <Image source={require('../../assets/images/icon_selected.png')} style={styles.ico} /> : null
                }
            </View>
)};

export default TooltipMenuItem;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#BFBFBF',
        borderRadius: 5,
        width: width / 3.5,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    ico: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: -1,
        bottom: -1
    }
});
