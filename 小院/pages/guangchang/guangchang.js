// pages/guangchang/guangchang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends:[
      {
        pic:'/imgs/vip.png',
        nickname:'超凡入圣',
        school:'南昌大学'
      },
      {
        pic: '/imgs/yuepay.png',
        nickname: '篱笆那边',
        school: '吉林大学'
      },
      {
        pic: '/imgs/heart2.png',
        nickname: '水蓝色的眼泪',
        school: '北京大学'
      },
    ]
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
    let user = wx.getStorageSync('user');
    let colleage = user.colleage;
      wx.setNavigationBarTitle({
        title: colleage,
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