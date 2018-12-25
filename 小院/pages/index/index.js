//index.js
//获取应用实例
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let WxSearch = require('../../wxSearch/wxSearch.js');

let buttonClicked = false; //默认还没有点击可以导航页面的按钮

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    loadingMore: false, //是否在加载更多
    isLoaded: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banners: [
      "https://xcx2.chinaplat.com/xy/images/1.png"
    ],
    courses: [1, 2, 3, 4, 5] //5个推荐分类，定义这个是为了展示载入动画有个循环数组
  },

  onLoad: function() {
    let self = this;
    this.setData({
      first: true //第一次载入默认首次载入
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onReady: function() {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        //初始化的时候渲染wxSearchdata
        WxSearch.init(self, windowHeight, ['中仕学社', '小程序', 'wxParse', 'wxSearch', 'wxNotification'],true,true,"",255);
        WxSearch.initMindKeys(['中仕学社', '微信小程序开发', '微信开发', '微信小程序']);
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },

  onShow: function() {
    let self = this;
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    //用户信息
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let colleage = user.colleage;
    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面
    let isSet = self.data.isSet; //是否已经重新设置

    buttonClicked = false;

    if ((isReLoad || first ) && user != "") { //如果user = "" ,
      wx.setNavigationBarTitle({ //设置标题
        title: user.colleage
      })

      self.setData({
        isLoaded: false
      })

      app.post(API_URL, "action=getCourseTypes_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&myself=2", false, false, "", "", "", self).then(res => {
        let result = res.data.data;
        let courses = [];

        //拼接数组
        for (let i = 0; i < result.length; i++) {
          let mycourses = result[i].list;
          courses = courses.concat(mycourses);
        }

        courses = courses.slice(0, 5); //截取前5个

        //先渲染推荐分类
        self.setData({
          isLoaded: true,
          courses: courses,
        })

        app.post(API_URL, "action=getCourseTypes_index&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1", false, false, "", "", "", self).then(res1 => {
          let dingzhiList = res1.data.data;
          let page_all = dingzhiList[0].page_all;

          self.setData({
            isSet: false,
            first: false,
            page: 1,
            page_all: page_all,
            dingzhiList: dingzhiList,
          })
        })
      })
      return
    }else if(isSet){//如果重新设置了
      app.post(API_URL, "action=getCourseTypes_index&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1", false, false, "", "", "", self).then(res1 => {
        let dingzhiList = res1.data.data;
        let page_all = dingzhiList[0].page_all;

        self.setData({
          isSet: false,
          first: false,
          page: 1,
          page_all: page_all,
          dingzhiList: dingzhiList,
        })
      })
    }

    //如果没有用户名，就导航到登录界面
    if (user == "") {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 课程订阅
   */
  markCourse: function() {
    if (buttonClicked) return;
    buttonClicked = true;

    wx.navigateTo({
      url: '/pages/index/markCourse/markCourse',
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let allpage = self.data.page_all;
    let page = self.data.page;
    let dingzhiList = self.data.dingzhiList;

    if (page >= allpage) {
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
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    page++;

    app.post(API_URL, "action=getCourseTypes_index&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=" + page, false, false, "", "", "", self).then(res => {
      let newDingzhiList = res.data.data;
      dingzhiList = dingzhiList.concat(newDingzhiList);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function() {
        self.setData({
          page: page,
          loadingMore: false,
          dingzhiList: dingzhiList,
          loadingText: ""
        })
      }, 200)
    })
  },

  /**
   * 取消定制
   */
  closeDingzhi: function(e) {
    let self = this;
    let typesids = e.currentTarget.dataset.typesids; //点击的分类id
    let typestitle = e.currentTarget.dataset.typestitle; //点击的分类标题
    let dingzhiList = self.data.dingzhiList; //所有订制

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    wx.showModal({
      title: '删除分类提示',
      content: '您确定取消订制本分类',
      success: function(v) {
        if (v.confirm) { //如果点击了确定
          console.log("action=delCourseTypes&loginrandom=" + loginrandom + "&zcode=" + zcode + "&typesids=" + typesids)
          app.post(API_URL, "action=delCourseTypes&loginrandom=" + loginrandom + "&zcode=" + zcode + "&typesids=" + typesids, false, false, "", "", "", self).then(res => {
            
            //删除该分类
            for (let i = 0; i < dingzhiList.length; i++) {
              let dingzhi = dingzhiList[i];
              if (dingzhi.id == typesids) {
                let index = dingzhiList.indexOf(dingzhi);
                if (index > -1) {
                  dingzhiList.splice(index, 1);
                }
              }
            }
            wx.showToast({
              icon: 'none',
              title: '删除分类"' + typestitle + '"成功',
              duration: 3000
            })
            self.setData({
              dingzhiList: dingzhiList
            })
          })
        }
      }
    })
  },

  /**
   * 搜索课程
   */
  search:function(e){
    let self  = this;
    self.setData({//只有点击搜索按钮时才更新Keywords
      Keywords: self.data.wxSearchData.value == undefined ? "" : self.data.wxSearchData.value
    })
    self.GOViewAll(e);
  },

  /**
   * 查看课程所有列表
   */
  GOViewAll:function(e){
    if(buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let typesid = e.currentTarget.dataset.typesid ? e.currentTarget.dataset.typesid:"";
    let buy = e.currentTarget.dataset.buy? e.currentTarget.dataset.buy:"";
    let favorite = e.currentTarget.dataset.favorite ? e.currentTarget.dataset.favorite:"";
    let Keywords = self.data.Keywords ? self.data.Keywords:"";
    let title = e.currentTarget.dataset.title ? e.currentTarget.dataset.title:"";
    let search = e.currentTarget.dataset.search;
    
    self.wxSearchFn(self);

    wx.navigateTo({
      url: "/pages/index/viewAll/viewAll?typesid=" + typesid + "&buy=" + buy + "&favorite=" + favorite + "&Keywords=" + Keywords + "&title=" + title + "&search=" + search
    })

    let wxSearchData = self.data.wxSearchData;
    wxSearchData.value = "";
    self.setData({
      wxSearchData: wxSearchData,
      Keywords:""
    })
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
      url: '/pages/index/keDetail/keDetail?kc_id='+kc_id+"&title="+title,
    })
  },

  /**
   * 处理搜索事件
   */
  wxSearchFn: function(e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);

  },
  wxSearchInput: function(e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function(e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function(e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function(e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function(e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function(e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  hideSearchChanle: function(e) {
    var that = this;
    if (e._relatedInfo.anchorTargetText == "") {
      WxSearch.wxSearchHiddenPancel(that);
    }
  }
})