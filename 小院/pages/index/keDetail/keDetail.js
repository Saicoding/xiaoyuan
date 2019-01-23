// pages/index/keDetail/keDetail.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let share = require('../../../common/share.js');
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catalogue: [1, 0, 0, 0],
    autoplay: true, //默认自动播放
    isPlaying: true, //默认是播放状态
    useFlux: false, //是否使用流量观看
    isWifi: true, //默认有wifi
    lastType: "first",
    commentFirstLoad: true, //评论第一次载入
    suggestFirstLoad: true, //推荐信息第一次载入
    loadingMore: false,
    showNobuy: false, //显示未购买信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    wx.getSystemInfo({//获取设备类型
      success: function (res) {
        self.setData({
          system: res.platform,//"devtools" "ios" "android"
        })
      }
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      options: options,
      first: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    self.myVideo = wx.createVideoContext("myVideo", this); //得到video组件

    //获得dialog组件
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let platform = res.platform;
        windowHeight = (windowHeight * (750 / windowWidth));
        console.log(platform)
        self.setData({
          platform: platform ,
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },
  /**
   * 播放进度改变时，记录播放进度
   */
  timeupdate: function(e) {
    let self = this;

    let currentTime = Math.floor(e.detail.currentTime); //当前播放时间

    self.setData({
      currentTime: currentTime
    })
  },
  /**
   * 导航到VIP页
   */
  GOVip:function(){
    wx.navigateTo({
      url: '/pages/mine/kaitong/kaitong',
    })
  },

  /**
   * 开通VIP
   */
  kaitong:function(e){
    let self = this;
    let system = self.data.system;
    if(system == 'devtools'){
      wx.showModal({
        title: '提示',
        content: '因Apple政策原因，IOS暂不支持小程序内开通VIP，苹果用户请使用安卓设备开通VIP！服务电话：4006-456-114',
        showCancel:false,
        confirmText: '了解了',
        confirmColor: '#2983fe'
      })
    }else{
      wx.showModal({
        title: '',
        content: '开通小院VIP,即可免费观看小院所有课程',
        confirmText: '开通',
        confirmColor: '#0096fa',
        success: function (e) {
          console.log(e)
          if (e.confirm) {
            self.GOVip();
          }
        }
      })
    }
  },

  /**
   * 拨打电话
   */
  phone:function(){
    wx.makePhoneCall({
      phoneNumber: '4006-456-114'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({//上拉加载可能触发重复登录
      loadingMore: false
    })
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let options = self.data.options;
    let kc_id = options.kc_id; //点击的id

    let isReLoad = self.data.isReLoad; //是否是重复登录
    let first = self.data.first; //是否是第一次渲染页面

    buttonClicked = false;

    //监测网络变化,未完善
    share.monitorConnectType(self);

    if ((isReLoad || first) && user != "") { //如果user = "" ,

      self.setData({
        isLoaded: false
      })

      console.log("action=GetCourseInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&kc_id=" + kc_id)
      app.post(API_URL, "action=GetCourseInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&kc_id=" + kc_id, false, false, "", "", "", self).then(res => {
        let kelist = res.data.data[0]; //所有课程信息


        //获取该页视频的播放进度数组
        let playRateArray = wx.getStorageSync("playRate" + kc_id + user.username);
        playRateArray = playRateArray == "" ? self.initPlayRateArray(kelist) : playRateArray;

        let lastidx = wx.getStorageSync('lastVideo' + kc_id + user.username); //上一次观看的id
        let index = lastidx == "" ? 0 : lastidx;

        let video = kelist.files[index];
        let buy = kelist.buy;
        //初始化视频信息
        self.initVideos(index, kelist);
        video.startTime = playRateArray[index]

        // wx.setStorageSync("turnonWifiPrompt", 0);

        self.setData({
          kelist: kelist,
          isLoaded: true,
          first: false,
          index: index,
          video: kelist.files[index],
          playRateArray: playRateArray,
          buy: buy
        })
      })

      // 得到有多少人在学习
      app.post(API_URL, "action=GetCourseStudents&cid=" + kc_id, false, false, "").then(res => {
        let headurls = res.data.data;
        self.setData({
          headurls: headurls
        })
      })
    }
  },

  /**
   * 初始化视频信息
   */
  initVideos: function(index, kelist) {
    let self = this;
    self.setIconTextColorByIndex(index, kelist); //改变视频选择状态
  },

  /**
   * 初始化进度数组（默认都是从0播放）
   */
  initPlayRateArray: function(kelist) {
    let playRateArray = [];

    for (let i = 0; i < kelist.files.length; i++) {
      playRateArray.push(0);
    }

    console.log(playRateArray)
    return playRateArray;
  },

  /**
 * 使用流量继续观看
 */
  continueWatch: function () {
    this.myVideo.play();
    this.setData({
      isPlaying: true,
      autoplay: true,
      useFlux: true
    })
  },

  /**
   * 改变视频时
   */
  changeVideo: function(e) {
    let self = this;

    let index = self.data.index; //点击之前的视频编号
    let keindex = e.currentTarget.dataset.keindex; //点击的视频编号

    if (index == keindex) return //如果点击了同一个视频就什么都不做

    let buy = self.data.buy; //是否购买

    let kelist = self.data.kelist;
    let lastCurrentTime = self.data.currentTime;
    let playRateArray = self.data.playRateArray;

    playRateArray[index] = lastCurrentTime;

    //改变选择状态
    self.setIconTextColorByIndex(keindex, kelist);

    let video = kelist.files[keindex];

    if (buy == "0" && video.shiting == "0") {//如果没有视听权限就停止播放，并且显示提示信息
      self.myVideo.stop();
      self.setData({
        showNobuy: true
      })
      self.kaitong();
    }else{//如果有权限，就隐藏信息
      self.myVideo.play();
      self.setData({
        showNobuy: false
      })
    }

    video.startTime = playRateArray[keindex]; //设置点击的视频初始播放位置

    self.setData({
      kelist: kelist, //保存所有视频
      video: video, //更改当前视频
      index: keindex, //更改当前的index
      playRateArray: playRateArray,
      currentTime: video.startTime //更改当前播放时间为当前播放的时间
    })
  },

  /**
   * 根据index改变选择状态
   */
  setIconTextColorByIndex(index, kelist) {
    for (let i = 0; i < kelist.files.length; i++) {
      let ke = kelist.files[i];
      ke.selected = i == index ? true : false //初始化播放状态
    }
  },

  /**
   * 改变目录
   */
  changeCatelogue: function(e) {
    let self = this;

    if (!self.data.kelist) { //如果还没有列表时就不执行
      wx.showToast({
        icon: "none",
        title: '还没有载入完毕',
        duration: 2000
      })
      return
    }

    let options = self.data.options;
    let index = e.currentTarget.dataset.index;
    let commentFirstLoad = self.data.commentFirstLoad; //是不是已经载入过一次
    let suggestFirstLoad = self.data.suggestFirstLoad; //推荐信息是不是第一次载入
    let cid = options.kc_id; //点击的id
    let typesid = self.data.kelist.typesid;

    let catalogue = [0, 0, 0, 0];
    catalogue[index] = 1;
    this.setData({
      catalogue: catalogue
    })

    if (index == 3 && commentFirstLoad) {
      self.setData({
        isLoaded: false,
      })

      app.post(API_URL, "action=GetCoursePL&cid=" + cid, false, false, "", "", "", self).then(res => {

        let result = res.data.list[0] == undefined ? [] : res.data.list[0];
        let comments = result.pllist == undefined ? [] : result.pllist; //所有评论
        let page_all = result.page_all == undefined ? 0 : result.page_all; //总页数
        if (comments == []) {
          wx.showToast({
            icon: "none",
            title: '当前无评论',
            duration: 2000
          })
        }

        self.setData({
          comments: comments,
          pageall: page_all,
          page: 1,
          commentFirstLoad: false, //载入一次后不再载入
          isLoaded: true,
        })

      })
    } else if (index == 2 && suggestFirstLoad) {
      //用户信息
      let user = wx.getStorageSync('user');
      let loginrandom = user.Login_random;
      let zcode = user.zcode;

      self.setData({
        isLoaded: false,
      })


      app.post(API_URL, "action=getCourseList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&buy=&favorite=&Keywords=&typesid=" + typesid, false, false, "", "", "", self).then(res => {
        let suggests = res.data.data[0].list;
        let pageall = res.data.data[0].pageall;
        console.log(res)

        self.setData({
          suggests: suggests,
          suggestPage: 1,
          suggestPageall: pageall,
          isLoaded: true,
          suggestFirstLoad: false
        })
      })
    }
  },

  /**
   * 导航到详情页
   */
  GOkedetail: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let kc_id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.redirectTo({
      url: '/pages/index/keDetail/keDetail?kc_id=' + kc_id + "&title=" + title,
    })
  },

  /**
   * 生命周期函数
   */
  onUnload: function() {
    this.save();
    let interval = this.data.interval;
    clearInterval(interval);
  },

  /**
   * 生命周期函数
   */
  onHide: function() {
    this.save();
    let interval = this.data.interval;
    clearInterval(interval);
  },

  /**
   * 保存播放进度和上一次观看视频
   */
  save: function() {
    let self = this;

    let options = self.data.options;

    let user = wx.getStorageSync("user");

    let kc_id = options.kc_id;
    let index = self.data.index;
    let buy = self.data.buy;

    let playRateArray = self.data.playRateArray;

    if (buy == 1 || index <= 2) { //如果已经购买或者前三个视频才保存
      wx.setStorageSync('lastVideo' + kc_id + user.username, index);
    }

    wx.setStorageSync("playRate" + kc_id + user.username, playRateArray);

    clearInterval(self.data.interval);
  },

  /**
   * 播放结束时
   */
  end: function() {
    let self = this;
    let index = self.data.index;
    let kelist = self.data.kelist;

    if (index < kelist.files.length - 1) { //如果还有下一个视频
      self.setIconTextColorByIndex(index + 1, kelist)
      self.setData({
        index: index + 1,
        video: kelist.files[index + 1],
        kelist: kelist
      })
    }
  },

  /**
   * 输入评论
   */
  inputComment: function(e) {
    this.setData({
      comment_content: e.detail.value //当前评论内容
    })
  },

  /**
   * 发送评论
   */
  sendComment: function() {
    let self = this;
    let comment_content = this.data.comment_content; //当前输入的评论
    let comments = this.data.comments; //当前所有评论
    let options = self.data.options;
    let kc_id = options.kc_id; //资讯ID

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //保存评论内容到服务器
    app.post(API_URL, "action=SaveCoursePL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&cid=" + kc_id + "&plcontent=" + comment_content, false, false, "", "", "", self).then(res => {

      //自定义一个时时显示的评论对象
      let mycomment = {};
      mycomment.pl_time = "1秒前"; //提交时间
      mycomment.pc_content = comment_content; //评论内容
      mycomment.nickname = user.Nickname;
      mycomment.userimg = user.Pic;

      self.setData({
        comments: comments,
        mycomment: mycomment,
        currentComment: "", //清空评论
      })

    })
  },

  /**
   * 滑动推荐到底部
   */
  suggestScrolltolower: function(e) {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行
    let suggestPageall = self.data.suggestPageall;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let typesid = self.data.kelist.typesid;
    
    let suggestPage = self.data.suggestPage;
    let suggests = self.data.suggests;
    let options = self.data.options;
    let cid = options.kc_id;

    if (suggestPage >= suggestPageall) {
      self.setData({ //正在载入
        suggestLoadingText: "别扯了，我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingMore: true,
      suggestLoadingText: "载入更多课程 ..."
    })

    suggestPage++;

    app.post(API_URL, "action=getCourseList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&buy=&favorite=&Keywords=&typesid=" + typesid + "&page=" + suggestPage, false, false, "", "", "", self).then(res => {
      let newSuggests = res.data.data[0].list;

      suggests = suggests.concat(newSuggests); //所有评论

      self.setData({
        suggests: suggests,
        suggestPage: suggestPage,
        showLoadingGif: false,
        loadingMore: false,
        suggestLoadingText: ""
      })
    })
  },

  /**
   * 滑动评论到底部时
   */
  scrolltolower: function(e) {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行
    let pageall = self.data.pageall;
    let page = self.data.page;
    let comments = self.data.comments;
    let options = self.data.options;
    let cid = options.kc_id;

    if (page >= pageall) {
      self.setData({ //正在载入
        loadingText: "别扯了，我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingMore: true,
      loadingText: "载入更多评论 ..."
    })

    page++;

    app.post(API_URL, "action=GetCoursePL&cid=" + cid + "&page=" + page, false, false, "", "", "", self).then(res => {
      let result = res.data.list[0];

      comments = comments.concat(result.pllist); //所有评论

      console.log(comments)
      self.setData({
        comments: comments,
        page: page,
        showLoadingGif: false,
        loadingMore: false,
        loadingText: ""
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let catalogue = self.data.catalogue;
    let cid = self.data.options.kc_id;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    if (catalogue[3] == 1) { //如果是评论页面
      app.post(API_URL, "action=GetCoursePL&cid=" + cid, false, false, "", "", "", self).then(res => {
        let result = res.data.list[0] == undefined ? [] : res.data.list[0];
        let comments = result.pllist == undefined ? [] : result.pllist; //所有评论

        console.log(comments)

        self.setData({
          comments: comments,
          page: 1,
          showLoadingGif: false,
          loadingMore: false,
          loadingText: ""
        })

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
})