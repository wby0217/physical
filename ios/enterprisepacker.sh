#!/bin/bash

if [[ $1 = '-f' ]]; then
  config_file=$2
fi

if [[ $config_file ]]; then
  config_list=($config_file)
else
  config_list=`ls configs/*.conf`
fi




function pack() {

  project_name='physical'

  config_file_name=$1
  . ./$config_file_name

  # app_version='1'
  # app_version_string='1.0.0'
  # app_name='体彩666'
  # app_bundle_id='com.physical.sports'
  # app_product_name='体彩666'
  # app_scheme='physical'
  # apple_id='body@my123shop.com'
  # config_name='physical'
  # api_server='https://sports-test1-frotend.kosun.net'
  # code_push_server='http://api.codepush.cc'
  # code_push_key='qupOLAXXn9oJ8RyPppcnhOo6joKX9ksvOPxlc'
  # jpush_key=''
  # umeng_key=''
  # channel='App Store'
  # signKey='JU076TFU-C483929E-2BDF8E9F-76TG45LJ'

  icons_path="configs/icons/$config_name/"
  launchimages_path="configs/launchImages/$config_name/"

  info_file="${project_name}/Info.plist"
  project_file="${project_name}.xcodeproj/project.pbxproj"
  appdelegate_file="${project_name}/AppDelegate.m"
  appconfigurationmodule_file="${project_name}/ReactBridge/AppConfigurationModule.m"

  cp $info_file ${info_file}.bp
	cp $project_file ${project_file}.bp
	cp $appdelegate_file ${appdelegate_file}.bp
	cp $appconfigurationmodule_file ${appconfigurationmodule_file}.bp

  # 替换 icon 和 launchimages
  cp -R ${icons_path} "${project_name}/Images.xcassets/AppIcon.appiconset"
  cp -R ${launchimages_path} "${project_name}/Images.xcassets/launch-small.imageset"

  # 替换 AppConfigurationModule.m 的 keys
	sed -i '' "s#todo-codePushServerURL#${code_push_server}#" $appconfigurationmodule_file
	sed -i '' "s/todo-codePushKey/${code_push_key}/" $appconfigurationmodule_file
	sed -i '' "s/todo-jpushAppKey/${jpush_key}/" $appconfigurationmodule_file
	sed -i '' "s/todo-umengAppKey/${umeng_key}/" $appconfigurationmodule_file
	sed -i '' "s#todo-apiServer#${api_server}#" $appconfigurationmodule_file
	sed -i '' "s/todo-channel/${channel}/" $appconfigurationmodule_file
	sed -i '' "s/todo-signKey/${signKey}/" $appconfigurationmodule_file

  fastlane update_infoplist key:"CFBundleDisplayName" value:$app_name
  fastlane update_infoplist key:"CFBundleIdentifier" value:$app_bundle_id
  fastlane update_infoplist key:"CFBundleShortVersionString" value:$app_version_string
  fastlane update_infoplist key:"CFBundleVersion" value:$app_version
  fastlane update_infoplist key:"CodePushDeploymentKey" value:$code_push_key
  fastlane update_infoplist key:"CodePushServerURL" value:$code_push_server
  # fastlane update_infoplist key:"CFBundleURLTypes" subkey:"CFBundleURLName" value:$app_scheme
  # fastlane update_infoplist key:"CFBundleURLTypes" subkey:"CFBundleURLSchemes" value:$app_bundle_id
  fastlane update_url_scheme scheme:$app_bundle_id

  ipa_path="ipas/"
  ipa_name="${app_product_name}_${app_version_string}_${app_version}"

  fastlane ios enterprise bundle_identifier:$app_bundle_id output_name:$ipa_name

  cp ${info_file}.bp $info_file
	cp ${project_file}.bp $project_file
	cp ${appdelegate_file}.bp $appdelegate_file
	cp ${appconfigurationmodule_file}.bp $appconfigurationmodule_file
	rm ${info_file}.bp
	rm ${project_file}.bp
	rm ${appdelegate_file}.bp
	rm ${appconfigurationmodule_file}.bp

}


for i in $config_list; do
  pack $i
done
