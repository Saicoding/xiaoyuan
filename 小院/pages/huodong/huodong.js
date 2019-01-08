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
    index:-1,//默认-1
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    isLoaded:false,//是否已经加载
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
      app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let page_all = res.data.data[0].page_all;
        let huodongs = res.data.data[0].list;
        console.log(huodongs)
        self.initHuodongs(huodongs)
        wx.setStorageSync('type' + zcode, huodongs);//本地缓存
        self.setData({
          first:false,
          isLoaded:true,
          zuixinFirst:true,
          page_all: page_all,
          page:1,
          huodongs: huodongs
        })
      })
    }
  },

  /**
   * 初始化活动信息
   */
  initHuodongs: function (huodongs){
    for (let i = 0; i < huodongs.length; i++) {
      let huodong = huodongs[i];
      switch (huodong.zhuangtai) {
        case "1":
          huodong.zhuangtaiStr = "报名中"
          huodong.color ="rgb(255, 145, 0)";
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
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let types = self.data.types;
    let index = self.data.index;

    let page_all = "";
    let page = "";
    let typesid = "";

    if(index == -1){//如果是最新活动
      page = self.data.page;
      page_all = self.data.page_all;
    }else{//其他分类
      typesid = types[index].id;
      page_all = types[index].page_all;
      page = types[index].page ;
    }

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

    app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=" + page+"&typesid="+typesid, false, false, "", "", "", self).then(res => {
      let newHuodongs = res.data.data[0].list;
      self.initHuodongs(newHuodongs);//初始化活动信息

      huodongs = huodongs.concat(newHuodongs);

      wx.setStorageSync('type' + zcode, huodongs);//本地缓存
      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          loadingMore: false,
          huodongs: huodongs,
          loadingText: ""
        })
      }, 200)

      if (index == -1) {
        self.setData({
          page:page
        })
      }else{
        types[index].page = page;
        self.setData({
          types:types
        })
      }
    })
  },


  /**
   * 导航到社团页面
   */
  getList: function(e) {
    let self = this;
    let typesid = e.currentTarget.dataset.typesid;
    let index = e.currentTarget.dataset.index !=undefined ? e.currentTarget.dataset.index:-1;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let types = self.data.types;

    for (let i = 0; i < types.length; i++) {
      types[i].selected = false;
    }

    if(index !=-1){//点击了除了最新活动的按钮
      types[index].selected = true;
      self.setData({
        zuixinSelected:false,
        types:types,
        loadingText: '',
        index:index
      })
      if (types[index].first){//如果已经载入一次就return
        let huodongs = wx.getStorageSync('type' + types[index].id + zcode);//本地缓存
        self.setData({
          huodongs: huodongs
        })
      }else{
        self.setData({
          isLoaded: false
        })
        //开始请求
        app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&typesid=" + typesid, false, false, "", "", "", self).then(res => {
          let huodongs = res.data.data[0].list;
          self.initHuodongs(huodongs);
          types[index].first = true;//设置分类已经有第一次载入
          types[index].page_all = res.data.data[0].page_all;
          types[index].page = 1;
          wx.setStorageSync('type' + types[index].id + zcode, huodongs);//本地缓存
          self.setData({
            huodongs: huodongs,
            isLoaded: true,
            types: types
          })
        })
      }

    }else{
      self.setData({
        zuixinSelected: true,
        loadingText:'',
        types: types,
        index: index
      })

      if (self.data.zuixinFirst) {//如果已经载入一次就return
        let huodongs = wx.getStorageSync('type'  + zcode);//本地缓存
        self.setData({
          huodongs: huodongs
        })
      } else {
        self.setData({
          isLoaded: false
        })
      }
    }
  },

  /**
   * 导航到详情页
   */
  GOhuodongDetail: function(e) {
    let h_id = e.currentTarget.dataset.id;
    console.log(h_id);
    wx.navigateTo({
      url: '/pages/huodong/huodongDetail/huodongDetail?h_id=' + h_id,
    })
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let types = self.data.types;
    let index = self.data.index;
    console.log(index)

    wx.showNavigationBarLoading() //在标题栏中显示加载

    if(index == -1){
      // 获取活动列表
      app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode, false, false, "", "", "", self).then(res => {
        let page_all = res.data.data[0].page_all;
        let huodongs = res.data.data[0].list;

        self.initHuodongs(huodongs)
        wx.setStorageSync('type' + zcode, huodongs);//本地缓存
        self.setData({
          first: false,
          isLoaded: true,
          zuixinFirst: true,
          page_all: page_all,
          page: 1,
          huodongs: huodongs
        })

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
    }else{
      //开始请求
      let typesid = types[index].id;
      app.post(API_URL, "action=getActivityList_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&typesid=" + typesid, false, false, "", "", "", self).then(res => {
        let huodongs = res.data.data[0].list;
        self.initHuodongs(huodongs);
        types[index].first = true;//设置分类已经有第一次载入
        types[index].page_all = res.data.data[0].page_all;
        types[index].page = 1;//设置当前页是1页
        wx.setStorageSync('type' + types[index].id + zcode, huodongs);//本地缓存
        self.setData({
          huodongs: huodongs,
          isLoaded: true,
          types: types,
        })

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
    }
  },
})