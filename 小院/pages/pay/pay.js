// pages/pay/pay.js
const API_URL = 'https://xcx2.chinaplat.com/'; //接口地址
const app = getApp(); //获取app对象
let buttonClicked = false; //默认还没有点击可以导航页面的按钮
let md5 = require('../../common/MD5.js');
let time = require('../../common/time.js');
let leftTime = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true, //默认第一次载入
    hasCompany: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;

    wx.getUserInfo({
      success: function (res) {
        let city = res.userInfo.city;
        let province = res.userInfo.province;

        app.post(API_URL, "action=getDlInfo&city=" + city + "&province=" + province, false, true, "").then((res) => {
          let company = res.data.data[0].Name;
          let dl = res.data.data[0].dl;
          let address = res.data.data[0].address == undefined ? "" : res.data.data[0].address;
          let tel = res.data.data[0].Tel
          if (dl == 0) { //如果没有城市代理
            wx.setNavigationBarColor({ //设置导航条颜色
              frontColor: "#ffffff",
              backgroundColor: "#6701c1",
              animation: {
                duration: 1000,
                timingFunc: 'easeIn',
              }
            })
            self.setData({ //设置成没有城市代理
              company: company,
              tel: tel,
              address: address,
              hasCompany: false
            })
          } else {
            self.setData({
              company: company,
              tel: tel,
              address: address,
              hasCompany: true
            })
          }
        })
      }
    })
  },

  /**
   * 拨打400电话
   */
  call400: function () {
    wx.makePhoneCall({
      phoneNumber: '400-6456-114' //仅为示例，并非真实的电话号码
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  },

  /**
   * 拨打电话
   */
  tel: function () {
    let phoneNumber = this.data.tel;
    wx.makePhoneCall({
      phoneNumber: phoneNumber //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期事件
   */
  onReady: function () {
    let self = this;

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
   * 生命周期事件
   */
  onShow: function () {

  },

})