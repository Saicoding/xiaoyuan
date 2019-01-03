// pages/mine/mine.js
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first:true
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
    wx.setNavigationBarTitle({
      title: '我的',
    })
    
    let self = this;
    buttonClicked = false;

    // 个人信息
    let user = wx.getStorageSync('user');
    let headPic = user.Pic;
    let nickname = user.Nickname;


    self.setData({
      headPic: headPic,
      nickname: nickname
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
   * 导航到VIP页面
   */
  GOVip:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/mine/vip/vip',
    })
  },

  /**
   * 退出登录
   */
  loginout:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.showModal({
      title: '提示',
      content: '确认退出登录吗?',
      confirmColor:'#0096fa',
      confirmText:'退出',
      success:function(res){
        if (res.confirm){
          wx.removeStorageSync('user');
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  }
})