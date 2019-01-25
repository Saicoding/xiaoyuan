// pages/mine/set/set.js
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
      title: '设置',
    })

    let isOn = wx.getStorageSync('turnonWifiPrompt') == 0 ? true : false;//检查非wifi开启状态

    if (isOn === "") {//如果没有本地缓存说明是第一次载入，默认是开启状态
      isOn = true
    }

    this.setData({
      isOn: isOn
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

  },

  /**
   * 开启wifi提醒
   */
  switchChange: function (e) {
    let isOn = e.detail.value ? 0 : 1;
    console.log(isOn)
    wx.setStorageSync('turnonWifiPrompt', isOn);
  },

  /**
   * 导航到反馈页面
   */
  GOfankui:function(){
    wx.navigateTo({
      url: '/pages/mine/fankui/fankui',
    })
  }

})