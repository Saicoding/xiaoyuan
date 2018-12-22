//index.js
//获取应用实例
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let WxSearch = require('../../wxSearch/wxSearch.js');

let buttonClicked = false; //默认还没有点击可以导航页面的按钮

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banners: [
      "https://xcx2.chinaplat.com/xy/images/1.png"
    ]
  },

  onLoad: function() {
    let self = this;

    this.setData({
      first: true //第一次载入默认首次载入
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onReady:function(){
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        //初始化的时候渲染wxSearchdata
        console.log(windowHeight)
        WxSearch.init(self, windowHeight, ['中仕学社', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
        WxSearch.initMindKeys(['中仕学社', '微信小程序开发', '微信开发', '微信小程序']);
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },

  onShow: function() {
    let self = this;
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录

    let colleage = user.colleage;
    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面

    buttonClicked = false;

    if ((isReLoad || first) && user != "") { //如果user = "" ,
      wx.setNavigationBarTitle({ //设置标题
        title: user.colleage
      })

      console.log(user)
      //用户信息
      let loginrandom = user.Login_random;
      let zcode = user.zcode;

      self.setData({
        isLoaded: false
      })

      app.post(API_URL, "action=getCourseTypes_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&myself=2", false, false, "", "", "", self).then(res => {
        let result = res.data.data;
        let courses = [];

        //拼接数组
        for (let i = 0; i < result.length; i++) {
          let mycourses = result[i].list;
          courses = courses.concat(mycourses);
        }

        courses = courses.slice(0, 5); //截取前5个

        self.setData({
          courses: courses
        })
      })


    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 课程订阅
   */
  markCourse:function(){
    if(buttonClicked) return;
    buttonClicked = true;

    wx.navigateTo({
      url: '/pages/index/markCourse/markCourse',
    })
  },

  /**
   * 处理搜索事件
   */
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  hideSearchChanle:function(e){
    var that = this;
    if(e._relatedInfo.anchorTargetText == ""){
      WxSearch.wxSearchHiddenPancel(that);
    }
  }
})