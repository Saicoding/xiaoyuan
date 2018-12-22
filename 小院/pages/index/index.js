//index.js
//获取应用实例
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";

let buttonClicked = false;//默认还没有点击可以导航页面的按钮

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad: function () {
    this.setData({
      first: true //第一次载入默认首次载入
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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

  onShow:function(){
    let self = this;
    let user = wx.getStorageSync('user');//先看下本地是否有用户信息，如果有信息说明已经登录

    let colleage = user.colleage;
    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面

    buttonClicked = false;

    if ((isReLoad || first) && user != "") {//如果user = "" ,
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

      console.log("action=getCoursePic&loginrandom=" + loginrandom + "&zcode=" + zcode);
      app.post(API_URL, "action=getCoursePic&loginrandom=" + loginrandom + "&zcode=" + zcode,false,false,"","","",self).then(res=>{
        console.log(res)
      })

    }else{
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
  }
})
