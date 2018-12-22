// pages/index/markCourse/markCourse.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";

let buttonClicked = false; //默认还没有点击可以导航页面的按钮

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    self.setData({
      isLoaded: false
    })

    app.post(API_URL, "action=getCourseTypes_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&myself=0", false, false, "", "", "", self).then(res => {
      console.log(res)
      self.setData({
        isLoaded: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})