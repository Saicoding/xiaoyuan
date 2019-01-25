// pages/mine/zhanghuzhongxin/jifenRecord/jifenRecord.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '积分收支记录',
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
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    app.post(API_URL,"action=getJifenRecords&loginrandom="+loginrandom+"&zcode="+zcode+"&page=1",false,false,"","","",self).then(res=>{
      let result = res.data.data[0];
      let list = result.list;
      let page_all = result.page_all;

      self.setData({
        list:list,
        page_all:page_all,
        page:1
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
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let allpage = self.data.page_all;
    let page = self.data.page;

    if (page >= allpage) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多记录 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let list = self.data.list;
    page++;

    app.post(API_URL, "action=getJifenRecords&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page="+page, false, false, "", "", "", self).then(res => {
      let newlist = res.data.data[0].list;
      list = list.concat(newlist);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          page: page,
          loadingMore: false,
          list: list,
          loadingText: ""
        })
      }, 200)
    })
  },
})