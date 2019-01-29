import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform
} from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Main, Result, Order, Center } from '../page';
import TabBarItem from './tabBarItem';
const Tabs = {
    Main: {
        screen: Main,
        navigationOptions: {
            header: null,
            tabBarLabel: '首页',
            headerBackTitle: null,
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    focused={focused}
                    normalImage={require('../assets/images/tabar/main.webp')}
                    selectedImage={require('../assets/images/tabar/main_a.webp')}
                />
            ),
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignSelf: 'center'
            }
        }
    },
    Result: {
        screen: Result,
        navigationOptions: {
            header: null,
            headerTitle: '比赛结果',
            tabBarLabel: '比赛结果',
            headerLeft: null,
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    focused={focused}
                    normalImage={require('../assets/images/tabar/result.webp')}
                    selectedImage={require('../assets/images/tabar/result_a.webp')}
                />
            ),
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignSelf: 'center'
            }
        }
    },
    Order: {
        screen: Order,
        navigationOptions: {
            headerTitle: '我的注单',
            tabBarLabel: '我的注单',
            headerLeft: null,
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    focused={focused}
                    normalImage={require('../assets/images/tabar/order.webp')}
                    selectedImage={require('../assets/images/tabar/order_a.webp')}
                />
            ),
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignSelf: 'center'
                }
            }
    },
    Center: {
        screen: Center,
        navigationOptions: {
            headerTitle: '会员中心',
            tabBarLabel: '会员中心',
            headerLeft: null,
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    focused={focused}
                    normalImage={require('../assets/images/tabar/center.webp')}
                    selectedImage={require('../assets/images/tabar/center_a.webp')}
                    isMember
                />
            ),
            headerTintColor: '#fff',
            headerTitleStyle: {
                alignSelf: 'center'
            }
        }
    }
}
const MyTabs = TabNavigator(Tabs, {
    tabBarOptions: {
        inactiveTintColor: '#929292',
        activeTintColor: '#17A84B',
        indicatorStyle: {height: 0},
        labelStyle: {
            fontSize: 10,
            margin: 0,
            paddingBottom: 3
        },
        showIcon: true,
        style: {
            backgroundColor: '#fff',
            marginVertical: 0,
            padding: 0,
            borderTopColor: '#D2D2D2',
            borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabStyle: {
            padding: 0,
            margin: 0,
        },
        iconStyle: {
            flexDirection: 'row',
            justifyContent: 'center'
        }
    },
    animationEnabled: false,
    backBehavior: 'none',
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    initialRouteName: 'Main',
    lazy: true
});
export const VirtualTabs = TabNavigator(Tabs, {
    tabBarOptions: {
        inactiveTintColor: '#929292',
        activeTintColor: '#17A84B',
        indicatorStyle: {height: 0},
        labelStyle: {
            fontSize: 10,
            margin: 0,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        showIcon: true,
        style: {
            backgroundColor: '#fff',
            marginVertical: 0,
            padding: 0,
        },
        tabStyle: {
            padding: 0,
            margin: 0
        },
        iconStyle: {
            flexDirection: 'row',
            justifyContent: 'center'
        }
    },
    animationEnabled: false,
    backBehavior: 'none',
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    initialRouteName: 'Center',
    lazy: true
});
export const OrderTabs = TabNavigator(Tabs, {
    tabBarOptions: {
        inactiveTintColor: '#929292',
        activeTintColor: '#17A84B',
        indicatorStyle: {height: 0},
        labelStyle: {
            fontSize: 10,
            margin: 0,
            flexDirection: 'row',
            justifyContent: 'center'
        },
        showIcon: true,
        style: {
            backgroundColor: '#fff',
            marginVertical: 0,
            padding: 0,
        },
        tabStyle: {
            padding: 0,
            margin: 0
        },
        iconStyle: {
            flexDirection: 'row',
            justifyContent: 'center'
        }
    },
    animationEnabled: false,
    backBehavior: 'none',
    swipeEnabled: false,
    tabBarPosition: 'bottom',
    initialRouteName: 'Order',
    lazy: true
});

export default MyTabs;
