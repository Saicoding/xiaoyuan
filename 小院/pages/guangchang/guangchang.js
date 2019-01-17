// pages/guangchang/guangchang.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false; //默认还没有点击可以导航页面的按钮
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDeveloping:true,
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
    buttonClicked = false;
    let user = wx.getStorageSync('user');
    let colleage = user.colleage;
      wx.setNavigationBarTitle({
        title: colleage,
      })
  },

  /**
   * 点击犄角旮旯
   */
  GOchat:function(){
    if(buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/guangchang/chat/chat',
    })
  }
})