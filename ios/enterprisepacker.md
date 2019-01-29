# 打包脚本使用教程

1.  双击安装 `fastlane/` 下的 `.mobileprovision` 和 `.p12` 文件
2.  cd 到 `ios/`
3.  命令行
    *  `./enterprisepacker.sh` 打包 `configs/` 下的所有配置对应的 ipa 包
    *  `./enterprisepacker.sh -f configs/to_be_packed.config` 打包指定配置的 ipa 包

## 证书过期的处理

1.  将 `fastlane/` 下过期的 `.mobileprovision` 和 `.p12` 文件删除
2.  将未过期的 `.mobileprovision` 和 `.p12` 文件拷贝到  `fastlane/`
3.  双击安装未过期的 `.mobileprovision` 和 `.p12` 文件
4.  cd 到 `ios/` 执行打包命令
