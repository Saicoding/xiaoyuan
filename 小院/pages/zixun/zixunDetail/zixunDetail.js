// pages/zixun/zixunDetail/zixunDetail.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let util = require('../../../utils/util.js');

let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    comments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    wx.removeStorageSync('first');

    this.setData({
      id: id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    console.log(user)
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let id = self.data.id; //资讯ID

    buttonClicked = false;

    //获取资讯
    app.post(API_URL, "action=getNewsShow&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id, false, false, "", "", "", self).then(res => {
      let zixun = res.data.data[0];
      self.setData({
        zixun: zixun,
        isLoaded: true
      })
      
      //获取评论
      app.post(API_URL, "action=getBrokeNewsPllist&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id, false, false, "", "", "", self).then(res=>{
        let comments = res.data.data[0].list;
        console.log(comments)
        let pageall = res.data.data[0].pageall;
        let pagenow = res.data.data[0].pagenow;
        let PLcounts = res.data.data[0].PLcounts;
        self.setData({
          comments:comments
        })
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 输入评论
   */
  inputComment:function(e){
    this.setData({
      comment_content: e.detail.value//当前评论内容
    })
  },

  /**
   * 发送评论
   */
  sendComment:function(){
    let self = this;
    let comment_content = this.data.comment_content;//当前输入的评论
    let comments = this.data.comments;//当前所有评论
    let aid = self.data.id; //资讯ID

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //保存评论内容到服务器
    app.post(API_URL, "action=addBrokeNewsPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&aid=" + aid +"&content="+comment, false, false, "", "", "", self).then(res => {

      //自定义一个时时显示的评论对象
      let comment = {};
      comment.addtime = "1秒前";//提交时间
      comment.agree = 0;
      comment.content = comment_content;//评论内容
      comment.nickname = user.Nickname;
      comment.userpic = user.Pic;


      comments.push(comment);//在已有的评论第一位置添加
      self.setData({
        comments: comments,
        currentComment:"",//清空评论
      })

    })    
  }
})