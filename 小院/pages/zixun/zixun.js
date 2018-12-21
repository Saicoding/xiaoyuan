// pages/zixun/zixun.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let util = require('../../utils/util.js');

let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingMore: false, //是否在加载更多
    loadingText: "" ,//上拉载入更多的文字
    showLoadingGif:false,//是否显示刷新gif图
    isRefreshing: false,//是否在下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.removeStorageSync('first');
    let requesttime = util.formatTime2(new Date()); //请求时间（第一次请求的时间）
    console.log(requesttime)
    this.setData({//最后请求的时间
      requesttime: requesttime
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    let user = wx.getStorageSync('user');

    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = wx.getStorageSync('first'); //是否是第一次渲染页面

    buttonClicked = false;

    if ((isReLoad || first == "") && user != "") { //如果重复登录或者第一次渲染才执行

      wx.setNavigationBarTitle({ //设置标题
        title: user.colleage
      })
      console.log(user)

      //用户信息
      let loginrandom = user.Login_random;
      let zcode = user.zcode;

      let date = new Date(); //当前信息
      let day = date.getDate(); //几日
      let dateStr = util.formatTime1(date); //日期字符串

      self.setData({
        dateStr: dateStr,
        day: day,
        isLoaded: false
      })

      let url = encodeURIComponent('/pages/index/index');
      console.log("action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1")
      app.post(API_URL, "action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1",false,false,"","","",self).then(res => {
        wx.setStorageSync("first", "false");
        let news = res.data.data[0].list; //所有资讯
        let allpage = res.data.data[0].allpage //所有页码

        self.setData({
          isLoaded: true,
          page: 1,
          news: news,
          allpage: allpage
        })
      })
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行
    let requesttime = self.data.requesttime;//最后请求的时间

    let allpage = self.data.allpage;
    let page = self.data.page;

    if (page >= allpage) {
      self.setData({ //正在载入
        loadingText: "没有了..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif:true,
      loadingText: "载入更多资讯 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let news = self.data.news;
    page++;

    app.post(API_URL, "action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=" + page).then(res => {
      let newNews = res.data.data[0].list;
      news = news.concat(newNews);

      self.setData({
        showLoadingGif:false,
        loadingText: "载入完成"
      })

      setTimeout(function() {
        self.setData({
          page: page,
          loadingMore: false,
          news: news,
          loadingText: ""
        })
      }, 200)
    })
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let news = self.data.news;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    let requesttime = util.formatTime2(new Date()); //请求时间（最后请求的时间）

    console.log("action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1" + "&requesttime=" + requesttime)

    app.post(API_URL, "action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1"  + "&requesttime=" + requesttime).then(res => {
      console.log(res)
      let newNews = res.data.data;
      console.log(newNews)
      news = newNews.concat(news);

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新


    })
  },
})