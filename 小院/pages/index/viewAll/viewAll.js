// pages/index/viewAll/viewAll.js
//获取应用实例
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";

let buttonClicked = false; //默认还没有点击可以导航页面的按钮

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded:false,
    hasKecheng:true,
    loadingMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let title = options.title ? options.title:'小院';

    wx.setNavigationBarTitle({
      title: title,
    })

    this.setData({
      options:options,
      first: true //第一次载入默认首次载入
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    buttonClicked = false;
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //上个页面传过来的参数
    let options = self.data.options;
    let typesid = options.typesid;
    let buy = options.buy;
    let favorite = options.favorite;
    let Keywords = options.Keywords;

    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面

    if ((isReLoad || first) && user != "") { //如果user != "" 
      self.setData({
        isLoaded: false
      })
      app.post(API_URL, "action=getCourseList&typesid=" + typesid + "&buy=" + buy + "&favorite=" + favorite + "&Keywords=" + Keywords + "&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res=>{
        let kelist = res.data.data[0].list;//课列表
        let pageall = res.data.data[0].pageall;//总页数

        if(kelist.length == 0){
          self.setData({
            hasKecheng:false
          })
        }
        console.log(kelist)
        self.setData({
          kelist:kelist,
          pageall:pageall,
          isLoaded:true,
          first: false,
          page:1
        })
      })
    }
  },

  /**
   * 导航到课程详情
   */
  GOkedetail:function(e){
    if (buttonClicked) return;
    buttonClicked = true;
    let kc_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/keDetail/keDetail?kc_id=' + kc_id,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行
    let pageall = self.data.pageall;
    let page = self.data.page;
    let kelist = self.data.kelist;

    if (page >= pageall) {
      self.setData({ //正在载入
        loadingText: "没有了..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingMore:true,
      loadingText: "载入更多资讯 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //上个页面传过来的参数
    let options = self.data.options;
    let typesid = options.typesid;
    let buy = options.buy;
    let favorite = options.favorite;
    let Keywords = options.Keywords;

    page++;

    app.post(API_URL, "action=getCourseList&typesid=" + typesid + "&buy=" + buy + "&favorite=" + favorite + "&Keywords=" + Keywords + "&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
      kelist = kelist.concat(res.data.data[0].list);//课列表

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成",
        page: page,
        loadingMore: false,
        kelist: kelist,
        loadingText: ""
      })
    })
  },
})