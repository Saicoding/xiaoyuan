// pages/mine/mine.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
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
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    app.post(API_URL, "action=getUserInfo&loginrandom=" + loginrandom+"&zcode="+zcode,false,false,"","","",self).then(res=>{
      let userInfo = res.data.data[0];
      console.log(userInfo)
      self.setData({
        userInfo: userInfo
      })
    })
  },

  /**
   * 导航到头像设置页面
   */
  GOsetHeadpic:function(){
    let userInfo = this.data.userInfo;
    let userInfoStr = JSON.stringify(userInfo);
    wx.navigateTo({
      url: '/pages/mine/setHeadpic/setHeadpic?userInfoStr=' + userInfoStr,
    })
  },

  /**
   * 导航到我的课程页面
   */
  GOviewall:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/index/viewAll/viewAll?favorite=yes',
    })
  },

  /**
   * 导航到VIP页面
   */
  GOvip:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/mine/vip/vip',
    })
  },

  /**
   * 导航到设置页面
   */
  GOset:function(){
    if (buttonClicked) return;
    buttonClicked = true;
    wx.navigateTo({
      url: '/pages/mine/set/set',
    })
  },

  /**
   * 我的活动
   */
  GOmyhuodong:function(){
    wx.navigateTo({
      url: '/pages/mine/huodong/huodong',
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
        }else{
          buttonClicked = false;
        }
      }
    })
  }
})