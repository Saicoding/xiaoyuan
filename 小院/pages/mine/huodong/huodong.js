// pages/mine/huodong/huodong.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    isLoaded: false,//是否已经加载
    hasHuodong:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ //设置标题
      title: "我参加的活动"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.viewForm = this.selectComponent("#viewForm");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({//上拉加载可能触发重复登录
      loadingMore: false
    })
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    buttonClicked = false;

    let self = this;

    // 获取活动列表
    app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&myself=1", false, false, "", "", "", self).then(res => {
      console.log(res);
      if(res.data.data[0].page_all != 0){//如果没有活动
        let page_all = res.data.data[0].page_all;
        let huodongs = res.data.data[0].list;
        self.initHuodongs(huodongs)
        self.setData({
          isLoaded: true,
          page_all: page_all,
          page: 1,
          hasHuodong:true,
          huodongs: huodongs
        })
      }
    })
  },

  /**
    * 初始化活动信息
    */
  initHuodongs: function (huodongs) {
    for (let i = 0; i < huodongs.length; i++) {
      let huodong = huodongs[i];
      switch (huodong.zhuangtai) {
        case "1":
          huodong.zhuangtaiStr = "报名中"
          huodong.color = "rgb(255, 145, 0)";
          break;
        case "2":
          huodong.zhuangtaiStr = "进行中"
          huodong.color = "green";
          break;
        case "3":
          huodong.zhuangtaiStr = "已结束"
          huodong.color = "red";
          break;
        default:
          console.log('获取活动状态出错')
          break;
      }
    }
  },

  /**
   * 切换到活动tab
   */
  enlist:function(){
    wx.switchTab({
      url: '/pages/huodong/huodong',
    })
  },
  /**
   * 导航到详情页
   */
  GOhuodongDetail: function (e) {
    let h_id = e.currentTarget.dataset.id;
    console.log(h_id);
    wx.navigateTo({
      url: '/pages/huodong/huodongDetail/huodongDetail?h_id=' + h_id,
    })
  },


  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let page = self.data.page;
    let page_all = self.data.page_all;

    if (page >= page_all) {
      self.setData({ //正在载入
        loadingText: "没有了..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多活动..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let huodongs = self.data.huodongs;
    page++;

    app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=" + page + "&myself=1", false, false, "", "", "", self).then(res => {
      let newHuodongs = res.data.data[0].list;
      self.initHuodongs(newHuodongs);//初始化活动信息

      huodongs = huodongs.concat(newHuodongs);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          loadingMore: false,
          huodongs: huodongs,
          loadingText: "",
          page: page
        })
      }, 200)
    })
  },

  /**
   * 产看订单
   */
  viewDingdan:function(e){
    let huodong = e.currentTarget.dataset.huodong;
    this.viewForm.setData({
      huodong: huodong
    })
    this.viewForm.showDialog();
  }

})