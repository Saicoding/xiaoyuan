// pages/huodong/huodong.js
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first: true, //第一次载入默认首次载入
    banners: [
      "https://xcx2.chinaplat.com/xy/images/1.png",
      "/imgs/banner1.png",
      "/imgs/banner2.png"
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    let pic = user.Pic;
    let huodongs = [
      {
        'src':'/imgs/banner1.png',
        'title':'中仕学社JAVA软件工程师课程邀请您参加线下培训班',
        'status':'报名中',
        'info':'收费',
        'headPics':[
          pic,pic
        ],
        'num':30,
        'over':false
      },
      {
        'src': '/imgs/banner2.png',
        'title': '中仕学社大数据工程课程邀请您参加线下培训班',
        'status': '已结束',
        'info': '免费',
        'headPics': [
          pic, pic
        ],
        'num':20,
        'over': true
      },
      {
        'src': '/imgs/head.jpg',
        'title': 'PHP课程邀请您参加线下培训班',
        'status': '已结束',
        'info': '收费',
        'headPics': [
          pic, pic
        ],
        'num': 30,
        'over': true
      },
      {
        'src': '/imgs/card.jpg',
        'title': '中仕学社自动化测试课程邀请您参加线下培训班',
        'status': '报名中',
        'info': '免费',
        'headPics': [
          pic, pic
        ],
        'num': 50,
        'over': false
      }
    ]

    this.setData({
      huodongs: huodongs
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
    let user = wx.getStorageSync('user');
    buttonClicked = false;
    wx.setNavigationBarTitle({ //设置标题
      title: user.colleage
    })
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 导航到社团页面
   */
  GOshetuan:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/huodong/shetuan/shetuan',
    })
  }
})