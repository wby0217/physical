import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import Swiper from '../../vendor/react-native-swiper';
import { CachedImage } from "react-native-img-cache";
import ProgressBar from 'react-native-progress/Bar';
import { service, showToast } from '../mesosphere';

const { width } = Dimensions.get('window');
export default class CarouselHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            swipershow: false,
        };
        this.timer = null;
    }
    componentDidMount() {
        const { dataSource } = this.state;
        service.carouselService()
        .then((res) => {
           if( res.data && res.data.length > 0 ){
               this.setState({
                   data: res.data,
                   swipershow: true
               });
           }
        })
        .catch(err => {
            service.ErrorHandle(err);
        })
    }
    render() {
        const { data, swipershow, dataSource } = this.state;
        const { navigation } = this.props;
        return (
            <View>
                {swipershow ?
                <Swiper
                    showsButtons={false}
                    width={width}
                    height={width * 300 / 750}
                    buttonWrapperStyle={{ alignItems: 'flex-start'}}
                    dotColor="#BABABA"
                    activeDotColor="#FFFFFF"
                    dotStyle={{ bottom: 10, }}
                    activeDotStyle={{ bottom: 10 }}
                    autoplay={true}
                    autoplayTimeout={2}
                    showsPagination={true}
                    paginationStyle={{ bottom: 5, height: 30, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 15, position: 'absolute', zIndex: 999 }}
                >
                    {
                       data && data.length ? Array.from(data).map((item, i) =>
                            <TouchableOpacity
                                activeOpacity={1}
                                key={i}
                                onPress={() => {
                                    navigation.navigate('ActivityDetail',{ ...item });
                                }}>
                                <CachedImage
                                    source={{ uri: item.activityImage }}
                                    resizeMode={Image.resizeMode.stretch} style={styles.banner}
                                    indicator={ProgressBar}
                                    mutable
                                />
                            </TouchableOpacity>
                        )
                        :
                        null
                    }
                </Swiper>
                :
                <View style={{ height: width * 300 / 750 }}>
                    <Image
                        source={require('../../assets/images/banner.png')}
                        resizeMode={Image.resizeMode.stretch}
                        style={styles.banner}
                    />
                </View>
                } 
            </View>
        );
    }
}
const styles = StyleSheet.create({
    banner: {
        width,
        height: width * 300 / 750
    }
});
