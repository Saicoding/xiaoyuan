// pages/huodong/huodong.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
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
  onLoad: function(options) {
    let user = wx.getStorageSync('user');
    let pic = user.Pic;
    let huodongs = [{
        'src': '/imgs/banner1.png',
        'title': '中仕学社JAVA软件工程师课程邀请您参加线下培训班',
        'status': '报名中',
        'info': '收费',
        'headPics': [
          pic, pic
        ],
        'num': 30,
        'over': false
      },
      {
        'src': '/imgs/banner2.png',
        'title': '中仕学社大数据工程课程邀请您参加线下培训班',
        'status': '已结束',
        'info': '免费',
        'headPics': [
          pic, pic
        ],
        'num': 20,
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    wx.setNavigationBarTitle({ //设置标题
      title: user.colleage
    })

    buttonClicked = false;

    let self = this;

    let first = self.data.first;
    let isReLoad = self.data.isReLoad;

    if (isReLoad || first) {
      app.post(API_URL, "action=getIndexPic&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let banners = res.data.data;
        console.log(banners)
        self.setData({
          banners: banners
        })
      })

      // // 获取活动话题分类
      app.post(API_URL, "action=getActivityTypes&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let types = res.data.data;
        self.setData({
          types:types,
        })
      })

      // 获取活动列表
      console.log("action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode)
      app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        console.log(res)
        self.setData({
          first:false
        })
      })
    }
  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 导航到社团页面
   */
  GOshetuan: function(e) {
    let typesid = e.currentTarget.dataset.typesid;
    if (buttonClicked) return;
    buttonClicked = true;
    console.log(typesid)
    wx.navigateTo({
      url: '/pages/huodong/shetuan/shetuan?typesid=' + typesid,
    })
  },

  /**
   * 导航到优惠页面
   */
  GOyouhui: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/huodong/youhui/youhui',
    })
  },

  /**
   * 导航到详情页
   */
  GOhuodongDetail: function() {
    wx.navigateTo({
      url: '/pages/huodong/huodongDetail/huodongDetail',
    })
  },

  /**
   * 导航到社团或者优惠界面
   */
  GOshetuanOryouhui: function() {

  }
})