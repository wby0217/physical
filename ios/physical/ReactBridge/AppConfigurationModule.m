//
//  ConfigurationKeys.m
//  angelia
//
//  Created by Mike on 05/12/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "AppConfigurationModule.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <sys/utsname.h>

@implementation AppConfigurationModule

RCT_EXPORT_MODULE();

- (NSDictionary<NSString *, id> *)constantsToExport {
  AppConfigurationModule *keys = [AppConfigurationModule sharedInstance];
  return @{@"apiServer":keys.apiServer,
           @"channel":keys.channelId,
           @"umengAppKey":keys.umengAppKey,
           @"jpushAppKey":keys.jpushAppKey,
           @"codePushKey":keys.codePushKey,
           @"codePushServerURL":keys.codePushServerURL,
           @"socialWechatAppId":keys.socialWechatAppId,
           @"socialWechatAppSecret":keys.socialWechatAppSecret,
           @"socialQQAppId":keys.socialQQAppId,
           @"socialQQAppSecret":keys.socialQQAppSecret,
           @"socialQQAppCallback":keys.socialQQAppCallback,
           @"socialSinaWeiboAppId":keys.socialSinaWeiboAppId,
           @"socialSinaWeiboAppSecret":keys.socialSinaWeiboAppSecret,
           @"socialSinaWeiboAppCallback":keys.socialSinaWeiboAppCallback,
           @"deviceModel":[self deviceModel], // @"iPhone10,3" -> @"iPhone X (CDMA)"  @"iPhone10,6" -> @"iPhone X (GSM)"
           @"signKey": keys.signKey
           };
}

- (NSString *)deviceModel {
  struct utsname systemInfo;
  uname(&systemInfo);
  NSString *deviceModel = [NSString stringWithCString:systemInfo.machine
                                             encoding:NSUTF8StringEncoding];
  return deviceModel;
}

+ (instancetype)sharedInstance {
  static dispatch_once_t onceToken;
  static AppConfigurationModule *keys;
  dispatch_once(&onceToken, ^{
    keys = [[AppConfigurationModule alloc] init];
  });
  return keys;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
#ifdef DEBUG
    self.apiServer   = @"https://fusion.spmobileapi.net";
    self.channelId     = @"physical";
    self.umengAppKey = @"5a220df18f4a9d249e000146";
    self.jpushAppKey = @"4b52b30f1bc81319772f2cf1";
    
    self.codePushKey        = @"qupOLAXXn9oJ8RyPppcnhOo6joKX9ksvOPxlc";
    self.codePushServerURL  = @"http://api.codepush.cc/";
    self.codePushAppVersion = @"1.0.0";
    
    self.socialWechatAppId     = @"";
    self.socialWechatAppSecret = @"";
    
    self.socialQQAppId       = @"";
    self.socialQQAppSecret   = @"";
    self.socialQQAppCallback = @"";
    
    self.socialSinaWeiboAppId       = @"";
    self.socialSinaWeiboAppSecret   = @"";
    self.socialSinaWeiboAppCallback = @"";
  
    self.signKey = @"JU076TFU-C483929E-2BDF8E9F-76TG45LJ";
#else
    self.apiServer   = @"todo-apiServer";
    self.channelId     = @"todo-channel";
    self.umengAppKey = @"todo-umengAppKey";
    self.jpushAppKey = @"todo-jpushAppKey";
    
    self.codePushKey        = @"todo-codePushKey";
    self.codePushServerURL  = @"todo-codePushServerURL";
    self.codePushAppVersion = @"1.0.0";
    
    self.socialWechatAppId     = @"todo-socialWechatAppId";
    self.socialWechatAppSecret = @"todo-socialWechatAppSecret";
    
    self.socialQQAppId       = @"todo-socialQQAppId";
    self.socialQQAppSecret   = @"todo-socialQQAppSecret";
    self.socialQQAppCallback = @"todo-socialQQAppCallback";
    
    self.socialSinaWeiboAppId       = @"todo-socialSinaWeiboAppId";
    self.socialSinaWeiboAppSecret   = @"todo-socialSinaWeiboAppSecret";
    self.socialSinaWeiboAppCallback = @"todo-socialSinaWeiboAppCallback";
    
    self.signKey = @"todo-signKey";
#endif
  }
  return self;
}

@end

