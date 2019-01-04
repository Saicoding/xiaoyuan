// pages/huodong/shetuan/shetuan.js
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
    let user = wx.getStorageSync('user');
    let pic = user.Pic;
    let huodongs = [
      {
        'src': '/imgs/banner1.png',
        'title': '中仕学社JAVA软件工程师课程邀请您参加线下培训班',
        'status': '报名中',
        'info': '20',
        'tequan': '校园·社团',
        'time': '集合时间：2019-1-23 9:0',
        'position': '集合地点：大学会馆北侧（鹏远出口处）大学会馆北侧（鹏远出口处）大学会馆北侧（鹏远出口处）大学会馆北侧（鹏远出口处）大学会馆北侧（鹏远出口处）',
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
        'info': '10',
        'tequan': '特权·优惠',
        'time': '集合时间：2019-1-23 9:0',
        'position': '集合地点：北京大学西苑',
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
        'info': '6',
        'tequan': '组团·砍价',
        'time': '集合时间：2019-5-26 9:0',
        'position': '集合地点：火车站西出口',
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
        'info': '2000',
        'time': '集合时间：2019-2-23 16:0',
        'position': '集合地点：金屋大厦',
        'tequan': '校园·文化',
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
    wx.setNavigationBarTitle({
      title: '特权·优惠',
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