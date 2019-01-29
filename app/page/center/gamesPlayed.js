// 玩法规则

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
import CustomActionSheet from '../../vendor/react-native-custom-modal';
import { Icons, service, ErrorHandle, Action, constants, Header } from '../mesosphere';
import staticData from '../../config/data';
import Accordion from '../../component/Accordion';

const { width } = Dimensions.get('window');
export default class GamesPlayed extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return ({
            header: null,
            headerTitle: '玩法规则',
            headerRight:<TouchableOpacity
                            style={styles.headerRightBtn}
                            onPress={() => { params && params.screenHandle()  }}
                        >
                            <Text style={{ color: '#fff' }}>筛选</Text>
                        </TouchableOpacity>,
            headerBackTitle: null
        })
    }
    constructor(props) {
        super(props)
        this.state = {
            sportTypes: [],
            activeSport: {},
            filterModalVisible: false,
            sportRules: staticData.gamesPlayed,
            selectedRuleType: {}
        }
    }
    componentWillMount() {
        const { navigation } = this.props;
        navigation.setParams({ screenHandle: this.screenHandle });
    }
    componentDidMount() {
        const { navigation } = this.props;
        storage.load({
            key: 'sportsTypes'
        })
        .then(res => {
            this.setState({
                sportTypes: res,
                activeSport: navigation.state.params ? navigation.state.params.ballType : res[0]
            }, () => {
                this.fetchData();
            })
        })
        .catch(err => {
            ErrorHandle(err)
        })
    }
    toggleFilterModal = () =>{
        const { filterModalVisible } = this.state;
        this.setState({
            filterModalVisible: !filterModalVisible
        })
    }
    screenHandle = () => {
        this.toggleFilterModal();
    }
    fetchData = () => {
        const { activeSport, sportRules } = this.state;
        if( sportRules[activeSport.engName] && sportRules[activeSport.engName].length > 0 ) {
            this.setState({
                selectedRuleType: sportRules[activeSport.engName][0]
            })
        } else {
            this.setState({
                selectedRuleType: ''
            })
        }
        
    }
    headerRight = () => {
        return (
            <TouchableOpacity
                onPress={this.toggleFilterModal}
            >
                <Text style={{ color: '#fff' }}>筛选</Text>
            </TouchableOpacity>
        )
    }
    headerLeft = () => {
        const { navigation } = this.props;
        const { params } = navigation.state;
        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    params && params.countDown && params.countDown();
                }}
                style={{ backgroundColor: 'transparent' }}
            >
                <Icons name="icon-back-normal" color="#ffffff" size={22} />
            </TouchableOpacity>
        )
    }
    render() {
        const { filterModalVisible, sportTypes, activeSport, sportRules, selectedRuleType } = this.state;
        const { navigation } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#46C24C' }}>
                <Header
                    headerTitle="玩法规则"
                    navigation = {navigation}
                    headerRight = {this.headerRight}
                    headerLeft= {this.headerLeft}
                />
                <ScrollView>
                        <View style={{ borderTopWidth: 1, borderColor: '#34B33A', marginTop: 25 }} /> 
                        <View style={{ alignItems: 'center', marginTop: -12.5 }}>
                            <Image
                                source={require('../../assets/images/center/icon_playRulesTitler.webp')}
                                style={{ height: 26, resizeMode: 'contain', width: 145 }}
                            />
                            <Text style={{ color: '#fff', marginTop: -22, backgroundColor: 'transparent', fontWeight: 'bold', fontSize: 14 }}>{activeSport.name}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10 }}>
                            {
                                sportRules[activeSport.engName] && sportRules[activeSport.engName][0] &&  sportRules[activeSport.engName][0].name && sportRules[activeSport.engName].length > 0 ?
                                <View style={{ marginTop: 15, backgroundColor: '#34B33A', borderColor: '#309E34', borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', flexWrap: 'wrap',  paddingVertical: 5, borderRadius: 5 }}>                    
                                    {sportRules[activeSport.engName].map((item, index) =>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ selectedRuleType: item })
                                                }}
                                                key={index}
                                                style={{ width: (width-22) / 4, alignItems: 'center', paddingVertical: 5 }}>
                                                <View style={[{ paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5 }, item.engName === selectedRuleType.engName ? { backgroundColor: '#FFF652' } : null ]}>
                                                    <Text style={[{ color: '#FFEC34', fontSize: 12 }, item.engName === selectedRuleType.engName ?  {color: '#986000'}: null]}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>: null
                            }
                                {
                                    selectedRuleType.content && selectedRuleType.content.length && selectedRuleType.content.map((item, index) => {
                                        return (
                                            <View key={index}>
                                                {
                                                item.title ? <View key={index}>
                                                   <View style={{ marginVertical: 10 }}>
                                                           <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>{item.title}</Text>
                                                   </View>
                                                   {
                                                       (item.second && item.second.length) ? item.second.map((obj, n) => {
                                                           return (
                                                               <View key={n}>
                                                                   <Accordion
                                                                       title={obj.secondTitile}
                                                                       containerStyle={{ borderRadius: 5, backgroundColor: '#fff', marginBottom: 10 }}
                                                                       titleStyle={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, height: 35 }}
                                                                       collapsed={true}
                                                                       iconSelect={true}
                                                                       titleTextColor= "#17A84B"
                                                                       key={n}
                                                                   >
                                                                       <View style={{ padding: 5 }}>
                                                                       {
                                                                           obj.list.length && obj.list.map((li, i) => {
                                                                               if(li.list && li.list.length > 0) {
                                                                               return (
                                                                                       <View key={i}>
                                                                                           <Text style={{ color: '#333333', lineHeight: 18, marginBottom: 5 }}>{i+1}.{li.text}</Text>
                                                                                           {
                                                                                               li.list.map(( child, ch ) => {
                                                                                                   return (
                                                                                                       <Text key={ch} style={{ color: '#333333', lineHeight: 18, marginBottom: 5, marginLeft: 20 }}>({ch+1}).{child.text}</Text>
                                                                                                   )
                                                                                               })
                                                                                           }
                                                                                       </View>
                                                                               )
                                                                               } else {
                                                                                   return (
                                                                                       <Text key={i} style={{ color: '#333333', lineHeight: 18, marginBottom: 5 }}>{i+1}.{li.text}</Text>
                                                                                   )
                                                                               }
                                                                           })
                                                                       }
                                                                       </View>
                                                                   </Accordion>
                                                               </View>
                                                           )
                                                       }) : <View/>
                                                   }
                                               </View> : (item.second && item.second.length) ? item.second.map((obj, n) => (
                                                    <View style={{ backgroundColor: '#fff', borderRadius: 5, marginVertical: 10, padding: 10 }} key={n}>
                                                        <Text style={{ color: '#17A84B', lineHeight: 30 }}>{obj.secondTitile}</Text>
                                                        {
                                                            obj.list.map((li, i) => {
                                                                return (
                                                                    <Text key={i} style={{ color: '#333333', lineHeight: 18, marginBottom: 5 }} key={i}>{i+1}.{li.text}</Text>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                )) : <View/>
                                                }
                                            </View>
                                        )
                                    })
                                }
                        </View>
                </ScrollView>
                <CustomActionSheet
                        modalVisible={filterModalVisible}
                        //TODO 名称
                        onCancel={this.toggleFilterModal}
                        buttonText='取消'
                        btnStyle={styles.btnStyle}
                    >
                        <View style={[styles.filterModalContainer]}>
                            <View style={styles.modalBoxTitle}>
                                <Text>选择类型</Text>
                            </View>
                            <View style={styles.modalKinds}>
                                {
                                    sportTypes && sportTypes.length > 0 ? sportTypes.map((items, i) =>
                                        <TouchableOpacity
                                            key={i}
                                            style={[styles.filterBtn, activeSport.id === items.id ? styles.filterBtnActive : {}]}
                                            onPress={() => {
                                                this.toggleFilterModal();
                                                this.setState({
                                                    activeSport: items
                                                }, () => {
                                                    this.fetchData();
                                                    })
                                                }}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterText,
                                                    activeSport.id === items.id ? styles.filterTextActive : {}
                                                ]}>
                                                {items.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null
                                }
                            </View>
                        </View>
                </CustomActionSheet>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerRightBtn: {
        padding: 10
    },
    btnStyle: {
        width,
        height: 50,
        alignSelf: 'center',
        alignItems: 'center',
    },
    filterModalContainer: {
        width,
        backgroundColor: '#F8F8F8',
        marginBottom: 10,
    },
    modalBoxTitle: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E5E5'
    },
    modalKinds: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    filterBtn: {
        width: width / 3.5,
        marginLeft: (width - 3 * width / 3.5) / 4,
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 10,
    },
    filterBtnActive: {
        backgroundColor: '#25C65E'
    },
    filterTextActive: {
        color: '#fff'
    },
    li: {
        lineHeight: 22,
        color: '#666666'
    }
})