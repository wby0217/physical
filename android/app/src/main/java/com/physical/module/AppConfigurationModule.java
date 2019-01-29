package com.physical.module;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.physical.MainApplication;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class AppConfigurationModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;

    public AppConfigurationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "AppConfigurationModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("apiServer", MainApplication.getAppConfiguration().apiServer);
        constants.put("codePushKey", MainApplication.getAppConfiguration().codepushKey);
        constants.put("codePushServerUrl", MainApplication.getAppConfiguration().codepushServerUrl);
        constants.put("channel", MainApplication.getAppConfiguration().channel);
        constants.put("umengAppKey", MainApplication.getAppConfiguration().umengAppKey);
        constants.put("umengAppSecret", MainApplication.getAppConfiguration().umengAppSecret);
        constants.put("jpushAppKey", MainApplication.getAppConfiguration().jpushAppKey);
        constants.put("signKey", MainApplication.getAppConfiguration().signKey);
        return constants;
    }
}
