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

    console.log("action=getNewsShow&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id)
    app.post(API_URL, "action=getNewsShow&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id, false, false, "", "", "", self).then(res => {
      let zixun = res.data.data[0];

      self.setData({
        zixun: zixun,
        isLoaded: true
      })

      console.log("action=getBrokeNewsPllist&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id)
      app.post(API_URL, "action=getBrokeNewsPllist&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + id, false, false, "", "", "", self).then(res=>{
        let comments = "";
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
      comment: e.detail.value
    })
  },

  /**
   * 发送评论
   */
  sendComment:function(){
    let self = this;
    let comment = this.data.comment;//当前输入的评论
    let comments = this.data.comments;//当前所有评论
    let aid = self.data.id; //资讯ID

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    console.log("action=addBrokeNewsPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&aid=" + aid + "&content=" + comment)
    app.post(API_URL, "action=addBrokeNewsPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&aid=" + aid +"&content="+comment, false, false, "", "", "", self).then(res => {

      comments.unshift(comment);//在已有的评论第一位置添加
      self.setData({
        comments: comments,
        currentComment:"",//清空评论
      })

    })    
  }
})