// pages/mine/vip/vip.js
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:"我的VIP"
    })

    let user = wx.getStorageSync('user');
    let headPic = user.Pic;
    this.setData({
      headPic: headPic
    })
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
    buttonClicked = false;
  },

  /**
   * 导航到开通vip页面
   */
  GOkaitong:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/mine/kaitong/kaitong',
    })
  }
})