// pages/index/viewAll/viewAll.js
//获取应用实例
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let WxSearch = require('../../../wxSearch/wxSearch.js');


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

    this.setData({
      options:options,
      first: true //第一次载入默认首次载入
    })
  },

  onReady: function () {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        //初始化的时候渲染wxSearchdata
        console.log(windowHeight)
        WxSearch.init(self, windowHeight, ['中仕学社', '小程序', 'wxParse', 'wxSearch', 'wxNotification'], true, true, "", 140);
        WxSearch.initMindKeys(['中仕学社', '微信小程序开发', '微信开发', '微信小程序']);
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({//上拉加载可能触发重复登录
      loadingMore: false
    })
    buttonClicked = false;
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //上个页面传过来的参数
    let options = self.data.options;
    let typesid = options.typesid == undefined ? "" : options.typesid;
    let buy = options.buy == undefined?"":options.buy;
    let favorite = options.favorite == undefined?"":options.favorite;
    let Keywords = options.Keywords == undefined?"":options.Keywords;

    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面

    if ((isReLoad || first) && user != "") { //如果user != "" 
      self.setData({
        isLoaded: false
      })
      console.log("action=getCourseList&typesid=" + typesid + "&buy=" + buy + "&favorite=" + favorite + "&Keywords=" + Keywords + "&loginrandom=" + loginrandom + "&zcode=" + zcode)
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
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/index/keDetail/keDetail?kc_id=' + kc_id+"&title="+title,
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
        page: page,
        loadingMore: false,
        kelist: kelist,
        loadingText: ""
      })
    })
  },
  /**
   * 导航到上一页面
   */
  back:function(){
    wx.navigateBack({
      
    })
  },

  /**
 * 搜索课程
 */
  search: function (e) {
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //上个页面传过来的参数
    let Keywords = self.data.wxSearchData.value == undefined ? "" : self.data.wxSearchData.value;

    self.setData({
      isLoaded: false,
      hasKecheng: true,
    })

    self.wxSearchFn(self);

    app.post(API_URL, "action=getCourseList&typesid=&buy=&favorite=&Keywords=" + Keywords + "&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
      let kelist = res.data.data[0].list;//课列表
      let pageall = res.data.data[0].pageall;//总页数

      if (kelist.length == 0) {
        self.setData({
          hasKecheng: false
        })
      }

      let wxSearchData = self.data.wxSearchData;
      wxSearchData.value = "";
      self.setData({
        kelist: kelist,
        pageall: pageall,
        isLoaded: true,
        first: false,
        page: 1,
        Keywords: "",
        wxSearchData: wxSearchData
      })
    })
    
  },

  /**
  * 处理搜索事件
  */
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSearchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  hideSearchChanle: function (e) {
    var that = this;
    if (e._relatedInfo.anchorTargetText == "") {
      WxSearch.wxSearchHiddenPancel(that);
    }
  }
})