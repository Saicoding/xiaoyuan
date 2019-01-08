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
    barIndex: 0
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
    let self = this;
    buttonClicked = false;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let h_id = self.data.h_id;

    console.log("action=getHdUserInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id)


    app.post(API_URL, "action=getActivityShow_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id, false, false, "", "", "", self).then(res => {
      let huodong = res.data.data[0];
      let hd_uid = huodong.userid;

      self.initHuodong(huodong);

      self.setData({
        isLoaded: true,
        huodong: huodong
      })

      app.post(API_URL, "action=getHdUserInfo&loginrandom=" + loginrandom + "&zcode=" + zcode + "&hd_uid=" + hd_uid, false, false, "", "", "", self).then(res => {
        let hdUserInfo = res.data.data[0];
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
          line1:"#0096fa",
          line2:"rgb(228, 228, 228)",
          line3:"rgb(228, 228, 228)",
          circle1:"rgb(255, 145, 0)",
          circle2:"rgb(228, 228, 228)",
          circle3: "rgb(228, 228, 228)",
          color1:"rgb(255, 145, 0)",
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
      huodong.money = "免费";
    } else {
      huodong.money = "¥" + huodong.money
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
    let barIndex = e.currentTarget.dataset.index; //点击的barIndex
    let moveData = barIndex == 0 ? animate.moveX(easeOutAnimation, 0) : animate.moveX(easeOutAnimation, 175); //得到动画数据
    this.setData({
      barIndex: barIndex,
      moveData: moveData
    })
  },

  /**
   * 导航到添加动态页面
   */
  GOaddDongtai: function() {
    wx.navigateTo({
      url: '/pages/huodong/addDongtai/addDongtai',
    })
  },

  /**
   * 报名
   */
  enlist: function() {
    wx.navigateTo({
      url: '/pages/huodong/enlist/enlist',
    })
  }

})