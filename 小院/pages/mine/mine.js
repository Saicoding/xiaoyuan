// pages/mine/mine.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true,
    guanzhu_records:0,
    fensi_records: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          system: res.platform,//"devtools" "ios" "android"
        })
      }
    })
  },
  /**
 * 生命周期函数
 */
  onReady: function () {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setNavigationBarTitle({
      title: '我的',
    })

    let self = this;
    buttonClicked = false;

    // 个人信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    this.setData({//设置随机数
      random: new Date().getTime()
    })

    app.post(API_URL, "action=getUserInfo&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
      let userInfo = res.data.data[0];
      console.log(userInfo)
      self.setData({
        userInfo: userInfo
      })
      //获取关注数
      app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=0" + "&page=1", false, false, "", "", "", self).then(res => {
        let result = res.data.data[0];
        let guanzhu_records = result.records;//关注总数
        self.setData({
          guanzhu_records: guanzhu_records
        })
      })

      //获取粉丝数
      app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=1" + "&page=1", false, false, "", "", "", self).then(res => {
        let result = res.data.data[0];
        let fensi_records = result.records;//关注总数
        self.setData({
          fensi_records: fensi_records
        })
      })
    })
  },
  /**
 * 导航到精品推荐
 */
  GOtuijian: function () {
    wx.navigateTo({
      url: '/pages/mine/tuijian/tuijian',
    })
  },
  /**
   * 导航到账户中心
   */
  GOzhanghuzhongxin:function(){
    wx.navigateTo({
      url: '/pages/mine/zhanghuzhongxin/zhanghuzhongxin',
    })
  },

  /**
   * 导航到头像设置页面
   */
  GOsetHeadpic: function() {
    let userInfo = this.data.userInfo;
    let userInfoStr = JSON.stringify(userInfo);
    wx.navigateTo({
      url: '/pages/mine/setHeadpic/setHeadpic?userInfoStr=' + userInfoStr,
    })
  },

  /**
   * 导航到我的课程页面
   */
  GOviewall: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/index/viewAll/viewAll?favorite=yes',
    })
  },

  /**
   * 导航到VIP页面
   */
  GOvip: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    let system = this.data.system;
    if(system == "ios"){
      wx.showModal({
        title: '提示',
        content: '因Apple政策原因，IOS暂不支持小程序内开通VIP，苹果用户请使用安卓设备开通VIP！服务电话：4006-456-114',
        showCancel:false,
        confirmText:'了解了',
        confirmColor: '#0096fa'
      })
      return;
    }

    wx.navigateTo({
      url: '/pages/mine/vip/vip',
    })
  },

  /**
   * 导航到设置页面
   */
  GOset: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/mine/set/set',
    })
  },

  /**
   * 我的活动
   */
  GOmyhuodong: function() {
    wx.navigateTo({
      url: '/pages/mine/huodong/huodong',
    })
  },

  /**
   * 导航到信息列表
   */
  GOIMlist: function() {
    wx.navigateTo({
      url: '/pages/IM/IMlist/IMlist',
    })
  },

  /**
   * 导航到关注列表
   */
  GOguanzhuList: function() {
    wx.navigateTo({
      url: '/pages/mine/guanzhuAndfensi/guanzhuAndfensi?guanzhu=1',
    })
  },

  /**
   * 导航到粉丝列表
   */
  GOfensiList: function() {
    wx.navigateTo({
      url: '/pages/mine/guanzhuAndfensi/guanzhuAndfensi?fensi=1',
    })
  },

  /**
   * 退出登录
   */
  loginout: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    wx.showModal({
      title: '提示',
      content: '确认退出登录吗?',
      confirmColor: '#0096fa',
      confirmText: '退出',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('user');
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          buttonClicked = false;
        }
      }
    })
  }
})