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
    zuixinSelected:true,//默认显示最新活动
    index:-1//默认-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
        self.setData({
          banners: banners
        })
      })

      // // 获取活动话题分类
      app.post(API_URL, "action=getActivityTypes&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let types = res.data.data;
        console.log(types)
        self.setData({
          types:types,
        })
      })

      // 获取活动列表
      console.log("action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode)
      app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let page_all = res.data.data[0].page_all;
        let huodongs = res.data.data[0].list;

        self.initHuodongs(huodongs)

        self.setData({
          first:false,
          page_all: page_all,
          page:1,
          huodongs: huodongs
        })
      })
    }
  },

  initHuodongs: function (huodongs){
    for (let i = 0; i < huodongs.length; i++) {
      let huodong = huodongs[i];
      switch (huodong.zhuangtai) {
        case "1":
          huodong.zhuangtaiStr = "报名中"
          break;
        case "2":
          huodong.zhuangtaiStr = "进行中"
          break;
        case "3":
          huodong.zhuangtaiStr = "已结束"
          break;
        default:
          console.log('获取活动状态出错')
          break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (huodongs) {
  },

  /**
   * 导航到社团页面
   */
  getList: function(e) {
    let self = this;
    let typesid = e.currentTarget.dataset.typesid;
    let index = e.currentTarget.dataset.index !=undefined ? e.currentTarget.dataset.index:-1;

    let types = self.data.types;

    for (let i = 0; i < types.length; i++) {
      types[i].selected = false;
    }

    if(index !=-1){//点击了除了最新活动的按钮
      types[index].selected = true;
      self.setData({
        zuixinSelected:false,
        types:types,
        index: index
      })
    }else{
      self.setData({
        zuixinSelected: true,
        types: types,
        index: index
      })
    }
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