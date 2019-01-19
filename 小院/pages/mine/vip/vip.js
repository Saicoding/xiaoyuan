// pages/mine/vip/vip.js
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
    wx.setNavigationBarTitle({
      title:"我的VIP"
    })

    let user = wx.getStorageSync('user');
    let headPic = user.Pic;
    this.setData({
      headPic: headPic
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

    app.post(API_URL,"action=getUserInfo&loginrandom="+loginrandom+"&zcode="+zcode,false,false,"","","",self).then(res=>{
      let userInfo = res.data.data[0];
      self.setData({
        userInfo: userInfo
      })
    })

  },

  /**
   * 导航到开通vip页面
   */
  GOkaitong:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    let vip = this.data.userInfo.Vip;
    let Ktime = this.data.userInfo.Ktime;
    let Jtime = this.data.userInfo.Jtime;
    wx.navigateTo({
      url: '/pages/mine/kaitong/kaitong?Vip='+vip+"&Ktime="+Ktime+"&Jtime="+Jtime,
    })
  }
})