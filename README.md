### 项目名Physical (体彩)
**描述**
`此项目重构了sport/client,升级rn版本,替换listview/navigation等组件,目录结构改变、service等优化`

* 目录结构

> -- physical 项目名 <br/>
> 	  -- app	开发目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- action action目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- assets 静态资源目录(img/icon等) <br/>
> &ensp;&ensp;&ensp;&ensp;-- component 组件目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- config 配置目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- page 业务目录 <br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; -- center 会员中心 <br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; --  main 大厅及子模块<br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; -- order 我的注单<br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; --  other 登录注册等其它<br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; --  result 比赛结果<br/>
> &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp; --  mesosphere.js <br/>
> &ensp;&ensp;&ensp;&ensp;-- reducers reducer目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- routes navigation导航目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- service 接口函数目录 <br/>
> &ensp;&ensp;&ensp;&ensp;-- store redux的store <br/>
> &ensp;&ensp;&ensp;&ensp;-- utils 工具类<br/>
> &ensp;&ensp;&ensp;&ensp;-- vendor 第三方组件<br/>
> &ensp;&ensp;&ensp;&ensp;-- index 入口<br/>
> 	  -- index.ios.js ios入口文件 <br/>
> 	  -- index.android.js 安卓入口文件 <br/>
>    -- bundle 打包文件 <br/>
> 
`说明: 业务模块中都会有index作为入口模块`

* 开发环境

`react 16.0.0-alpha.12`<br/>
`react-native 0.46.4` <br/>
`xcode v8.0` <br/>
`android simulator API22 5.1.0` <br/>
`08-23升级rn版本 0.47.2` <br/>

* 插件

1. react-native-animatable 快速构建动画组件
2. react-native-datepicker 时间插件
3. react-native-easy-grid  表格组件
4. react-native-loading-spinner-overlay 加载loading组件
5. react-native-parallax-view  下拉放大图片组件
6. react-native-root-toast  提示框组件
7. react-native-scrollable-tab-view tab切换插件
8. react-native-simple-modal 模态提示框
9. react-native-storage   持久化存储
10. react-native-swiper   轮播图
11. react-native-vector-icons  字体图标组件
12. react-native-webp  兼容webp格式图片
13. react-navigation   导航组件
14. react-navigation-is-focused-hoc  tabs切换获取焦点状态
15. react-redux redux集成RN


`*体彩客户端项目重构后,结构简介!`

## code push 更新

```
node codepush.js ios physical
node codepush.js android physical 
node codepush.js all
```
## code push 威廉希尔的测试站点

```
node codepush.js ios wlxe
node codepush.js android wlxe

```

## 下载地址

* <https://download.dgstaticresources.net/physical/android/app-weilian-release.apk>
* <itms-services://?action=download-manifest&url=https://download.dgstaticresources.net/physical/ios/weilian.plist>

