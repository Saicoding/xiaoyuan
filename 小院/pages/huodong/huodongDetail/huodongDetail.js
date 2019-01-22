// pages/huodong/huodongDetail/huodongDetail.js
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    imDetail: true, //活动详情页
    barIndex: 0, //点击的是活动详情还是活动动态
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let h_id = options.h_id;
    this.setData({
      h_id: h_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
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
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({ //上拉加载可能触发重复登录
      loadingMore: false
    })
    let self = this;
    buttonClicked = false;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let h_id = self.data.h_id;

    app.post(API_URL, "action=getActivityShow_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id, false, false, "", "", "", self).then(res => {
      let huodong = res.data.data[0];

      let hd_uid = huodong.userid;

      self.initHuodong(huodong);

      self.setData({
        isLoaded: true,
        huodong: huodong,
        zcode: zcode
      })

      app.post(API_URL, "action=getHdUserInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&hd_uid=" + hd_uid, false, false, "", "", "", self).then(res => {
        let hdUserInfo = res.data.data[0];
        console.log(hdUserInfo)
        self.setData({
          hdUserInfo: hdUserInfo
        })
      })
    })
  },

  /**
   * 初始化活动信息
   */
  initHuodong: function(huodong) {
    switch (huodong.zhuangtai) {
      case "1":
        huodong.status = "报名中";
        huodong.color = "rgb(255, 145, 0)";
        huodong.style = {
          line1: "#0096fa",
          line2: "rgb(228, 228, 228)",
          line3: "rgb(228, 228, 228)",
          circle1: "rgb(255, 145, 0)",
          circle2: "rgb(228, 228, 228)",
          circle3: "rgb(228, 228, 228)",
          color1: "rgb(255, 145, 0)",
          color2: "rgb(228, 228, 228)",
          color3: "rgb(228, 228, 228)",
        }
        break;
      case "2":
        huodong.status = "进行中";
        huodong.color = "green";
        huodong.style = {
          line1: "#0096fa",
          line2: "#0096fa",
          line3: "rgb(228, 228, 228)",
          circle1: "#0096fa",
          circle2: "green",
          circle3: "rgb(228, 228, 228)",
          color1: "rgb(228, 228, 228)",
          color2: "green",
          color3: "rgb(228, 228, 228)",
        }
        break;
      case "3":
        huodong.status = "已结束";
        huodong.color = "red";
        huodong.style = {
          line1: "#0096fa",
          line2: "#0096fa",
          line3: "#0096fa",
          circle1: "#0096fa",
          circle2: "#0096fa",
          circle3: "red",
          color1: "rgb(228, 228, 228)",
          color2: "rgb(228, 228, 228)",
          color3: "red",
        }
        break;
    }
    // 初始化价格
    if (huodong.money == "0.00") {
      huodong.price = "免费";
    } else {
      huodong.price = "¥" + huodong.money
    }

    // 获取日期字符串
    let hddate = huodong.hddate;
    hddate = hddate.substring(0, hddate.lastIndexOf(','));
    huodong.dateArray = hddate.split(",");
    huodong.dateStr = huodong.dateArray[0] + "至" + huodong.dateArray[huodong.dateArray.length - 1] + " " + huodong.dateArray.length + "天可选"

  },

  /**
   * 切换目录时
   */
  changeMulu: function(e) {
    let self = this;

    let h_id = self.data.h_id;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let barIndex = e.currentTarget.dataset.index; //点击的barIndex
    let moveData = barIndex == 0 ? animate.moveX(easeOutAnimation, 0) : animate.moveX(easeOutAnimation, 175); //得到动画数据
    let isDongtaiLoaded = this.data.isDongtaiLoaded; //活动动态是否已经载入

    this.setData({
      barIndex: barIndex,
      moveData: moveData
    })

    if (barIndex == 1 && !isDongtaiLoaded) {
      app.post(API_URL, "action=GetHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id, false, false, "", "", "", self).then(res => {
        console.log(res)
        let dongtaiList = res.data.data[0];
        let dongtai_page_all = dongtaiList.page_all;
        let dongtais = dongtaiList.list;

        self.initDongtaiImages(dongtais);

        self.setData({
          dongtai_page_all: dongtai_page_all, //一共有多少页
          dongtais: dongtais, //动态列表
          page: 1,
          isDongtaiLoaded: true //设置活动动态已经载入
        })
      })
    }
  },

  /**
   * 初始化动态图像
   */
  initDongtaiImages: function(dongtais) {
    for (let i = 0; i < dongtais.length; i++) {
      let dongtai = dongtais[i];
      dongtai.images = dongtai.images.split(',').splice(1);
    }
  },

  /**
   * 删除动态
   */
  deleteDongtai: function(e) {
    let self = this;
    let d_id = e.currentTarget.dataset.did;
    let h_id = self.data.h_id;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtais = self.data.dongtais;
    wx.showModal({
      title: '提示',
      content: '确定删除动态信息吗?',
      success: (res) => {
        if (res.confirm) {
          app.post(API_URL, "action=DelHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&d_id=" + d_id, false, false, "", "", "", self).then(res => {
            for (let i = 0; i < dongtais.length; i++) { //如果删除接口请求成功就从本地数组中去除，实现实时显示
              let dongtai = dongtais[i];
              if (dongtai.d_id == d_id) {
                dongtais.splice(i, 1);
                self.setData({
                  dongtais: dongtais
                })
                wx.showToast({
                  icon: 'none',
                  title: '删除成功',
                  duration: 3000
                })
                break;
              }
            }
          })
        }
      }
    })
  },

  /**
   * 导航到添加动态页面
   */
  GOaddDongtai: function() {
    let h_id = this.data.h_id;
    wx.navigateTo({
      url: '/pages/huodong/addDongtai/addDongtai?h_id=' + h_id,
    })
  },

  /**
   * 导航到动态详情页面
   */
  GOdongtaiDetail: function(e) {
    let dongtai = e.currentTarget.dataset.dongtai;
    console.log(dongtai)
    let h_id = this.data.h_id;
    let jsonStr = JSON.stringify(dongtai);
    jsonStr = encodeURIComponent(jsonStr);
    wx.navigateTo({
      url: '/pages/huodong/dongtaiDetail/dongtaiDetail?jsonStr=' + jsonStr + "&h_id=" + h_id
    })
  },

  /**
   * 导航到报名列表
   */
  GObaomingList: function() {
    let h_id = this.data.h_id;
    wx.navigateTo({
      url: '/pages/huodong/baomingList/baomingList?h_id=' + h_id,
    })
  },

  /**
   * 报名
   */
  enlist: function() {
    let h_id = this.data.h_id; //活动ID
    let huodong = this.data.huodong; //活动对象
    let hddate = huodong.hddate; //报名日期字符串组
    let hdtime = huodong.hdtime; //参加活动时间
    let title = huodong.title; //活动标题
    let buy = huodong.buy; //已经报名的日期

    //套餐信息
    let money = huodong.money;
    let money2 = huodong.money2;
    let money3 = huodong.money3;
    let money4 = huodong.money4;
    let money5 = huodong.money5;
    let money6 = huodong.money6;
    let money7 = huodong.money7;
    let money8 = huodong.money8;
    let money9 = huodong.money9;
    let money10 = huodong.money10;

    wx.navigateTo({
      url: '/pages/huodong/enlist/enlist?h_id=' + h_id + '&hddate=' + hddate + '&hdtime=' + hdtime + "&title=" + title +
        "&money=" + money +
        "&money2=" + money2 +
        "&money3=" + money3 +
        "&money4=" + money4 +
        "&money5=" + money5 +
        "&money6=" + money6 +
        "&money7=" + money7 +
        "&money8=" + money8 +
        "&money9=" + money9 +
        "&money10=" + money10 +
        "&buy=" + buy
    })
  },

  /**
   * 赞
   */
  zan: function(e) {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtais = self.data.dongtais;
    let h_id = self.data.h_id;
    let index = e.currentTarget.dataset.index;
    let dtid = e.currentTarget.dataset.id;

    app.post(API_URL, "action=SaveHdDdongtai_agree&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&dtid=" + dtid, false, false, "", "", "", self).then(res => {
      let dongtai = dongtais[index];
        dongtai.zan = parseInt(dongtai.zan) + 1;
        dongtai.zan_self = 1;
        wx.showToast({
          icon: 'none',
          title: '称赞成功',
          duration: 3000
        })
        self.setData({
          dongtais: dongtais
        })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolower: function() {
    console.log('ok')
    let self = this;
    let loadingMore = self.data.loadingMore;
    let h_id = self.data.h_id;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let barIndex = self.data.barIndex; //如果当前目录是活动动态

    if (barIndex == 1) {
      console.log('haah')
      let allpage = self.data.dongtai_page_all;
      let page = self.data.page;

      if (page >= allpage) {
        self.setData({ //正在载入
          loadingText: "别扯了,我是有底线的..."
        })
        return;
      }

      self.setData({ //正在载入
        showLoadingGif: true,
        loadingText: "载入更多动态 ..."
      })

      //用户信息
      let user = wx.getStorageSync('user');
      let loginrandom = user.Login_random;
      let zcode = user.zcode;

      let dongtais = self.data.dongtais;
      page++;

      app.post(API_URL, "action=GetHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&page=" + page, false, false, "", "", "", self).then(res => {
        let dongtaiList = res.data.data[0];
        let newDongtais = dongtaiList.list;
        self.initDongtaiImages(newDongtais);
        dongtais = dongtais.concat(newDongtais); //拼接数组
        console.log(newDongtais)

        self.setData({
          showLoadingGif: false,
          loadingText: "载入完成"
        })

        setTimeout(function() {
          self.setData({
            page: page,
            loadingMore: false,
            dongtais: dongtais,
            loadingText: ""
          })
        }, 200)
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let news = self.data.news;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    let requesttime = util.formatTime2(new Date()); //请求时间（最后请求的时间）

    app.post(API_URL, "action=getNewsList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1" + "&requesttime=" + requesttime, false, false, "", "", "", self).then(res => {
      if (res.data.data.length > 0) {
        let newNews = res.data.data[0].list;
        news = newNews.concat(news);

        self.setData({
          news: news
        })
      }

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },

  /**
   * 切换是否关注
   */
  toogleMark: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let userid = e.currentTarget.dataset.userid;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let dongtais = self.data.dongtais;
    console.log(dongtais)

    app.post(API_URL, "action=user_gz&loginrandom=" + loginrandom + "&zcode=" + zcode + "&userid=" + userid, false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      if (result) {
        for (let i = 0; i < dongtais.length; i++) {
          let baoming = dongtais[i];
          if (baoming.userid == userid) { //找到点击的人
            baoming.guanzhu = baoming.guanzhu == 0 ? 1 : 0;
            buttonClicked = false;
            self.setData({
              dongtais: dongtais
            })
            wx.showToast({
              icon: 'none',
              title: baoming.guanzhu == 0 ? '取消关注成功' : '关注成功',
              duration: 3000
            })
            return;
          }
        }
      }
    })
  },

  /**
   * 切换收藏状态
   */
  toogleShoucang: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let h_id = self.data.h_id;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let huodong = self.data.huodong;

    app.post(API_URL, "action=HdShouCang&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id, false, false, "", "", "", self).then(res => {
      if (res.data.data.result) {
        if (huodong.ShouCang == "" || huodong.ShouCang == "0") {
          huodong.ShouCang = "1";
        } else {
          huodong.ShouCang = "0";
        }

        self.setData({
          huodong: huodong
        })
      }
    })
  },

  /**
   * 导航到个人主页
   */
  GOuserInfo: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let userid = e.currentTarget.dataset.userid;
    let guanzhu = e.currentTarget.dataset.guanzhu;
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userid=' + userid + "&guanzhu=" + guanzhu,
    })
  },

  /**
   * 导航到聊天窗口
   */
  GOchat:function(e){
    let user = wx.getStorageSync('user');
    let headpic = e.currentTarget.dataset.headpic;//点击的头像
    let myHeadpic = user.Pic;//我的头像
    let username = e.currentTarget.dataset.username;//点击的用户名

    let toid = e.currentTarget.dataset.userid;//点击的用户id
    wx.navigateTo({
      url: '/pages/IM/IM?userid=' + toid + "&headpic=" + headpic + "&myHeadpic=" + myHeadpic + "&username=" + username,
    })
  }
})