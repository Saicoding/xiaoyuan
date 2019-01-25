// pages/login/login.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let MD5 = require("../../common/MD5.js");
let WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js');
let appId = "wxfc4ecbaf91acfaf6";
let app = getApp();

let buttonClicked = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPwd: true,
    openId: '', //用户唯一标识  
    unionId: '',
    encryptedData: '',
    platform:'android'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "登录"
    })
    let self = this;
    this.setData({
      url: decodeURIComponent(options.url) == undefined ? "" : decodeURIComponent(options.url),
      url1: options.url == undefined ? "" : options.url,
      ifGoPage: options.ifGoPage == undefined ? false : options.ifGoPage
    })

    let rememberPwd = wx.getStorageSync('loginUser') ? true : false //如果没有本地缓存,就默认是不记住密码

    if (rememberPwd) {
      let loginUser = wx.getStorageSync('loginUser'); //缓存的用户名和密码
      this.setData({
        userText: loginUser.userText,
        pwdText: loginUser.pwdText
      })
    }

    this.setData({
      rememberPwd: rememberPwd
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    buttonClicked = false;
  },

  /**
   * 生命周期函数
   */
  onReady:function(){
    let self = this;
    //获得dialog组件
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let platform = res.platform;
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          platform: platform
        })
      }
    });
  },

  /**
   * 处理输入完账号后直接点击密码框自动关闭键盘的BUG
   */
  setFocus:function(e){
    let type = e.currentTarget.dataset.type;
    let self = this;
    if(type=="user"){
      setTimeout(function () {
        self.setData({
          userFocus: true,
          pwdFocus:false
        })
      }, 100)
    }else{
      setTimeout(function () {
        self.setData({
          userFocus: false,
          pwdFocus: true
        })
      }, 100)
    }


  },

  /**
   * 账号密码登录
   */
  login: function() {
    let self = this;

    //限制连续点击
    if (buttonClicked) return;
    buttonClicked = true;


    let userText = self.data.userText; //当前输入的账户
    let pwdText = self.data.pwdText; //当前输入的密码
    let ifGoPage = self.data.ifGoPage //是否返回上一级菜单

    let info = "";

    if (!userText && !pwdText) {
      info = "用户名和密码不能为空"
    } else if (!userText) {
      info = "用户名不能为空";
    } else if (!pwdText) {
      info = "密码不能为空"
    }

    if (info != "") { //如果输入不规范
      wx.showToast({
        icon: "none",
        title: info,
        duration: 3000
      })
    } else {
      let md5Pwd = MD5.md5(pwdText).toLowerCase(); //小写md5加密密码

      app.post(API_URL, "action=Login&user=" + userText + "&pwd=" + md5Pwd, true, false, "登录中").then(res => {
        let user = res.data.data[0];
        let rememberPwd = self.data.rememberPwd; //是否记住密码
        if (rememberPwd) { //如果选择了记住密码就存储本地缓存
          let loginUser = {
            'userText': userText,
            'pwdText': pwdText
          }
          wx.setStorage({
            key: 'loginUser',
            data: loginUser
          })
        } else { //如果没有选择记住密码就清除本地缓存
          wx.removeStorage({
            key: 'loginUser'
          })
        }
        self.processSelectScholl(user, ifGoPage);

      })
    }
  },

  /**
   * 微信授权登录
   */
  wxLogin: function(e) {
    let self = this;
    //限制连续点击
    if (buttonClicked) return;
    buttonClicked = true;

    wx.login({
      success: res => {
        let code = res.code;
        app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "登录中").then((res) => {
          let sesstion_key = res.data.sessionKey;
          let openid = res.data.openid;

          wx.getUserInfo({
            success: function (res) {
              let wxid = ""; //openId
              let session_key = ""; //

              let encryptedData = res.encryptedData;
              let iv = res.iv;
              let signature = res.signature; //签名
              let nickname = res.userInfo.nickName; //昵称
              let headurl = res.userInfo.avatarUrl; //头像
              let sex = res.userInfo.gender //性别

              //拿到session_key实例化WXBizDataCrypt（）这个函数在下面解密用
              let pc = new WXBizDataCrypt(appId, sesstion_key);
              let data = pc.decryptData(encryptedData, iv);
              let unionid = data.unionId;

              let ifGoPage = self.data.ifGoPage //是否返回上一级菜单
              let url = self.data.url; //需要导航的url

              app.post(API_URL, "action=LoginWx&unionId=" + unionid + "&openid=" + openid + "&nickname=" + nickname + "&headurl=" + headurl + "&sex=" + sex, false, false, "").then((res) => {
                let user = res.data.list[0];
                self.processSelectScholl(user, ifGoPage); 
              })
            }
          })
        })
      },
      fail:function(){

      }
    })
  },

  /**
   * 根据是否选择学校来处理登录逻辑
   */
  processSelectScholl: function(user, ifGoPage) {
    let self = this;
    let x_id = user.x_id; //是否绑定学校

    if (x_id == 0) { //如果没有绑定学校
      self.setData({ //将user设为本页面的变量，后续跳转到绑定学校页面需要用到
        user: user
      })

      let loginrandom = user.Login_random;
      let zcode = user.zcode;

      wx.showModal({
        title: '提示',
        content: '请绑定您所在学校',
        showCancel: false,
        success(res) {
          wx.navigateTo({ //导航到选择学校页面
            url: '/pages/selectSchool/selectSchool?loginrandom=' + loginrandom + "&zcode=" + zcode,
          })
        }
      })
    } else { //如果选择学校
      wx.setStorageSync('user', user)
      wx.navigateBack({}) //先回到登录前的页面

      if (ifGoPage == 'true') {
        wx.navigateTo({
          url: url,
        })
      }
    }
  },

  /**
   * 输入账号时存储变量
   */
  userInput: function(e) {
    this.setData({
      userText: e.detail.value
    })
  },

  /**
   * 输入密码时存储变量
   */
  pwdInput: function(e) {
    this.setData({
      pwdText: e.detail.value
    })
  },

  /**
   * 点击清除按钮
   */
  clearText: function() {
    this.setData({
      userText: ""
    })
  },

  /**
   * 点击眼睛符号，改变是否显示密码
   */
  changeShowPwd: function() {
    this.setData({
      showPwd: !this.data.showPwd
    })
  },

  /**
   * 改变记录密码方式
   */
  changeRememberPwd: function() {
    this.setData({
      rememberPwd: !this.data.rememberPwd
    })
  },

  /**
   * 返回上一页面
   */
  back:function(){
    wx.navigateBack({})
  }
})