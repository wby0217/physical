const { execSync } = require("child_process");
var dateFormat = require("dateformat");
var inquirer = require("inquirer");
var genVersion = require("./updateLog");
var fs = require("fs");
global.loggedIn = false;
const apps = [
  {
    name: "physical",
    user: "sports",
    config: "physical",
    app_android: "physical-android",
    app_ios: "physical-ios",
    version_android: "1.0.0",
    version_ios: "1.0.0"
  },
  {
    name: "wlxe",
    user: "wlxe",
    config: "physical",
    app_android: "wlxe-android",
    app_ios: "wlxe-ios",
    version_android: "1.0.0",
    version_ios: "1.0.0"
  }
];

const codePushServerConfig = {
  userName: "fusion@gmail.com",
  accessKey: "EWYV2ST4LqeO2TOA9Kh6FQxmWq9U6ksvOXqoq"
};

const log = (message, color = "33") =>
  console.log(`\x1b[${color}m%s\x1b[0m`, message);

const initVersionInfo = {
  version: "V1.0.0",
  updateTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
  updateContent: "这个人很懒,没有任何备注~"
};
const questions = [
  {
    type: "input",
    name: "remark",
    message: "请输入更新简要:",
    validate: value => {
      if (value) {
        return true;
      } else {
        return "请留下备注信息~";
      }
    }
  }
];

const codepush = {
  sports: {
    email: "sports@kosun.com",
    key: "SKuyn9NeTAHkQ3dURMJBgRmQ4hDt9ksvOPxlc" // 更新时间 2017-10-10， 两个月过期
  },
  wlxe: {
    email: "sports@kosun.com",
    key: "SKuyn9NeTAHkQ3dURMJBgRmQ4hDt9ksvOPxlc" // 更新时间 2017-10-10， 两个月过期
  }
};
const exec = (cmd, opt = {}, printLog = true) => {
  if (printLog)
    console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m", "Run command: ", cmd);
  return new Promise(resolve => {
    try {
      const output = execSync(cmd, {
        encoding: "utf8",
        ...opt
      });
      resolve(output);
    } catch (err) {
      resolve(err);
    }
  });
};

const login = async () => {
  try {
    if (global.loggedIn) return;
    log("正在登录 codepush server...");
    const curUser = await exec("code-push whoami", { stdio: "pipe" }, false);
    if (curUser === codePushServerConfig.userName) {
      global.loggedIn = true;
    } else {
      await exec("code-push logout", { stdio: "ignore" }, false);
      await exec(
        `code-push login https://api.codepush2.com --accessKey ${
          codePushServerConfig.accessKey
        }`,
        { stdio: "ignore" },
        false
      );
      global.loggedIn = true;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const beginCodePush = () => {
  let log = "codepush start!";
  console.log(log);

  let params = process.argv;
  let platform = "all";
  let appName = null;
  let deployment = "Production";

  const doPush = async app => {
    console.log(
      `=================== ${app.name} ${platform} start ===================`
    );
    await login();
    try {
      execSync(
        `code-push release-react ${
          app["app_" + platform]
        } ${platform} -d ${deployment} -t ${app["version_" + platform]}`,
        { stdio: [0, 1, 2] }
      );
    } catch (e) {
      console.log(e.toString());
    } finally {
      console.log(
        `=================== ${app.name} ${platform} end ===================`
      );
      genVersion(initVersionInfo, platform);
    }
  };
  if (params[2]) {
    platform = params[2];
  }
  if (params[4]) {
    deployment = params[4];
  }
  if (params[3]) {
    appName = params[3];
    let app = apps.filter(n => n.name === appName)[0];
    if (!app) {
      console.log("Please enter the correct application name");
    } else {
      console.log(app.name);
      doPush(app);
    }
  } else {
    if (platform == "all") {
      let platforms = ["ios", "android"];
      for (let pf of platforms) {
        platform = pf;
        for (let app of apps) {
          doPush(app);
        }
      }
    } else {
      for (let app of apps) {
        doPush(app);
      }
    }
  }

  log = "codepush end!";
  console.log(log);
};
beginCodePush();
