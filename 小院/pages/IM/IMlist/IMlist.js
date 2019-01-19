// pages/IM/IMlist/IMlist.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ececec',
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
    buttonClicked = false;
    let self = this;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    app.post(API_URL,"action=getChatUserList&loginrandom="+loginrandom+"&zcode="+zcode+"&page=1",false,false,"","","",self).then(res=>{
      let chatList = res.data.data;
      console.log(res)
      wx.setNavigationBarTitle({
        title: '小院('+chatList.length+')',
      })
      self.setData({
        chatList:chatList
      })
    })
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
   * 导航到聊天对话框
   */
  GOIM:function(e){
    let user = wx.getStorageSync('user');
    let headpic = e.currentTarget.dataset.headpic;//点击的头像
    let myHeadpic = user.Pic;//我的头像
    let username = e.currentTarget.dataset.username;//点击的用户名

    let toid = e.currentTarget.dataset.toid;//点击的用户id
    wx.navigateTo({
      url: '/pages/IM/IM?userid='+toid+"&headpic="+headpic+"&myHeadpic="+myHeadpic+"&username="+username,
    })
  }

})