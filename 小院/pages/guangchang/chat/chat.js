// pages/guangchang/chat/chat.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars:[
      {
        title:"最新",
        selected:true
      },
      {
        title:"暴走段子",
        selected:false
      },
      {
        title: "奇葩校园",
        selected: false
      },
      {
        title: "文艺青年",
        selected: false
      },
      {
        title: "游戏动漫",
        selected: false
      },
      {
        title: "服饰美妆",
        selected: false
      },
      {
        title: "我是拍客",
        selected: false
      },
      {
        title: "单纯约",
        selected: false
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

  },

  /**
   * 返回上一页面
   */
  back:function(){
    wx.navigateBack({})
  },

  /**
   * 点击了搜索
   */
  search:function(){
    console.log('点击了搜索')
  }
})