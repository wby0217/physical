package com.physical.entity;

import java.io.Serializable;

public class AppConfiguration implements Serializable {

    public String umengAppKey;
    public String umengAppSecret;
    public String codepushKey;
    public String codepushAppVersion = "1.0.0";
    public String codepushServerUrl;
    public String channel;
    public String jpushAppKey;

    public String apiServer;
    public String signKey;
}
