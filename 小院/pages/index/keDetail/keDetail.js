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
    autoplay:true,//默认自动播放
    isPlaying: true, //默认是播放状态
    useFlux: false, //是否使用流量观看
    isWifi: true, //默认有wifi
    lastType: "first",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    //获得dialog组件
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
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
  onShow: function() {
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



    if ((isReLoad || first) && user != "") { //如果user = "" ,

      self.setData({
        isLoaded: false
      })

      app.post(API_URL, "action=GetCourseInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&kc_id=" + kc_id, false, false, "", "", "", self).then(res => {
        let kelist = res.data.data[0];//所有课程信息

        let lastidx = wx.getStorageSync('lastVideo' + kc_id + user.username);//上一次观看的id
        let index = lastidx ==""?1:lastidx;
        console.log(lastidx)
        console.log(kelist)
        //初始化视频信息
        self.initVideos(index,kelist);

        wx.setStorageSync("turnonWifiPrompt", 0);

        //监测网络变化,未完善
        // share.monitorConnectType(self);

        self.setData({
          kelist: kelist,
          isLoaded: true,
          first: false,
          video: kelist.files[index]
        })
      })
    }
  },

  /**
   * 初始化视频信息
   */
  initVideos: function (index,kelist){
    let self = this;
    self.setIconTextColorByIndex(index, kelist);//改变视频选择状态
  },

  /**
   * 改变视频时
   */
  changeVideo:function(e){
    let self = this;

    let index = self.data.index;//点击之前的视频编号
    let keindex = e.currentTarget.dataset.keindex;//点击的视频编号
    if (index == keindex) return //如果点击了同一个视频就什么都不做

    let kelist = self.data.kelist;

    
    //改变选择状态
    self.setIconTextColorByIndex(keindex,kelist);

    self.setData({
      kelist:kelist,//保存所有视频
      video:kelist.files[keindex],//更改当前视频
      index: keindex,//更改当前的index
    })
  },

  /**
   * 根据index改变选择状态
   */
  setIconTextColorByIndex(index,kelist){
    for (let i = 0; i < kelist.files.length; i++) {
      let ke = kelist.files[i];
      ke.selected = i == index ? true : false//初始化播放状态
    }
  },

  /**
   * 改变目录
   */
  changeCatelogue: function(e) {
    let index = e.currentTarget.dataset.index;
    let catalogue = [0, 0, 0, 0];
    catalogue[index] = 1;
    this.setData({
      catalogue: catalogue
    })
  },

  /**
   * 生命周期函数
   */
  onUnload: function () {
    let self = this;

    let options = self.data.options;

    let user = wx.getStorageSync("user");

    let kc_id = options.kc_id;
    let index = self.data.index;
   
    wx.setStorageSync('lastVideo' + kc_id + user.username, index);
    clearInterval(self.data.interval);
  },

  /**
   * 生命周期函数
   */
  onHide:function(){
    let self = this;

    let options = self.data.options;

    let user = wx.getStorageSync("user");

    let kc_id = options.kc_id;
    let index = self.data.index;

    wx.setStorageSync('lastVideo' + kc_id + user.username, index);
    clearInterval(self.data.interval);
  },

  /**
   * 播放结束时
   */
  end:function(){
    let self = this; 
    let index = self.data.index;
    let kelist = self.data.kelist;

    if (index < kelist.files.length-1){//如果还有下一个视频
      self.setIconTextColorByIndex(index+1, kelist)
      self.setData({
        index:index+1,
        video:kelist.files[index+1]
      })
    }
    
  }
})