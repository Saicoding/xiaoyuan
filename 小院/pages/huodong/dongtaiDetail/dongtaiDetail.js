// pages/huodong/dongtaiDetail/dongtaiDetail.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    comments: [],
    loadingMore: false, //是否正在载入更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let dongtai = JSON.parse(options.jsonStr);
    console.log(dongtai)
    this.setData({
      dongtai: dongtai,
      h_id: options.h_id
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
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let dongtai = self.data.dongtai;
    let dt_id = dongtai.d_id;

    buttonClicked = false;

    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page=1", false, false, "", "", "", self).then(res => {
      console.log(res)
      let comments = res.data.data[0].list;
      let pageall = res.data.data[0].pageall; //评论总页数
      let pagenow = res.data.data[0].pagenow; //当前评论页
      let PLcounts = res.data.data[0].PLcounts;
      // let PLcounts = res.data.data[0].PLcounts;
      self.setData({
        comments: comments,
        page: 1,
        pageall: pageall,
        pagenow: pagenow
      })
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 输入评论
   */
  inputComment: function(e) {
    this.setData({
      comment_content: e.detail.value //当前评论内容
    })
  },

  /**
   * 发送评论
   */
  sendComment: function() {
    let self = this;
    let comment_content = this.data.comment_content; //当前输入的评论
    let comments = this.data.comments; //当前所有评论
    let dongtai = self.data.dongtai;
    let h_id = self.data.h_id; //资讯ID\
    let dt_id = dongtai.d_id;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //保存评论内容到服务器
    app.post(API_URL, "action=SaveHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&content=" + comment_content + "&dt_id=" + dt_id, false, false, "", "", "", self).then(res => {
      console.log(res)

      //自定义一个时时显示的评论对象
      let mycomment = {};
      mycomment.addtime = "1秒前"; //提交时间
      mycomment.content = comment_content; //评论内容
      mycomment.nickname = user.Nickname;
      mycomment.userpic = user.Pic;
      mycomment.from = "保密(开发中)";

      comments.unshift(mycomment)

      self.setData({
        comments: comments,
        mycomment: mycomment,
        currentComment: "", //清空评论
      })

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let pageall = self.data.pageall;

    if (pageall == undefined) return;
    let page = self.data.page;

    let dongtai = self.data.dongtai;
    let dt_id = dongtai.d_id;

    if (page >= pageall) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多评论 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let comments = self.data.comments;
    page++;

    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page="+page, false, false, "", "", "", self).then(res => {
      comments = comments.concat(res.data.data[0].list);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          page: page,
          loadingMore: false,
          comments: comments,
          loadingText: ""
        })
      }, 200)
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtai = self.data.dongtai;
    let dt_id = dongtai.d_id;

    wx.showNavigationBarLoading() //在标题栏中显示加载


    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page=1", false, false, "", "", "", self).then(res => {
      let comments = res.data.data[0].list;
      let pageall = res.data.data[0].pageall;
      let pagenow = res.data.data[0].pagenow;
      let PLcounts = res.data.data[0].PLcounts;

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

      self.setData({
        comments: comments,
        page: 1
      })
    })
  },

})