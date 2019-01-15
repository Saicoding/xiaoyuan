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
    barIndex: 0//点击的是活动详情还是活动动态
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
    let isDongtaiLoaded = this.data.isDongtaiLoaded;//活动动态是否已经载入

    this.setData({
      barIndex: barIndex,
      moveData: moveData
    })

    if(barIndex ==1 && !isDongtaiLoaded){
      app.post(API_URL, "action=GetHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id,false,false,"","","",self).then(res=>{
        console.log(res)
        let dongtaiList = res.data.data[0];
        let dongtai_page_all = dongtaiList.page_all;
        let dongtais = dongtaiList.list;
        
        self.initDongtaiImages(dongtais);

        self.setData({
          dongtai_page_all: dongtai_page_all,//一共有多少页
          dongtais: dongtais,//动态列表
          isDongtaiLoaded:true//设置活动动态已经载入
        })
      })
    }
  },

  /**
   * 初始化动态图像
   */
  initDongtaiImages:function(dongtais){
    for(let i = 0;i<dongtais.length;i++){
      let dongtai = dongtais[i];
      dongtai.images = dongtai.images.split(',').splice(1);
    }
  },

  /**
   * 删除动态
   */
  deleteDongtai:function(e){
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
      success:(res)=>{
        if(res.confirm){
          app.post(API_URL, "action=DelHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&d_id=" + d_id, false, false, "", "", "", self).then(res => {
            for (let i = 0; i < dongtais.length;i++){//如果删除接口请求成功就从本地数组中去除，实现实时显示
              let dongtai = dongtais[i];
              if (dongtai.d_id == d_id){
                dongtais.splice(i, 1); 
                self.setData({
                  dongtais:dongtais
                })
                wx.showToast({
                  icon:'none',
                  title: '删除成功',
                  duration:3000
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
  GOdongtaiDetail:function(e){
    let dongtai = e.currentTarget.dataset.dongtai;
    let h_id = this.data.h_id;
    let jsonStr = JSON.stringify(dongtai);
    wx.navigateTo({
      url: '/pages/huodong/dongtaiDetail/dongtaiDetail?jsonStr=' + jsonStr+"&h_id="+h_id
    })
  },

  /**
   * 报名
   */
  enlist: function() {
    let h_id = this.data.h_id;//活动ID
    let huodong = this.data.huodong;//活动对象
    let hddate = huodong.hddate;//报名日期字符串组
    let hdtime = huodong.hdtime;//参加活动时间
    let title = huodong.title;//活动标题

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

    //已经报名的日期
    let buy = huodong.buy;

    wx.navigateTo({
      url: '/pages/huodong/enlist/enlist?h_id='+h_id+'&hddate='+hddate+'&hdtime='+hdtime+"&title="+title+
      "&money="+money+
        "&money2=" + money2 +
        "&money3=" + money3 +
        "&money4=" + money4 +
        "&money5=" + money5 +
        "&money6=" + money6 +
        "&money7=" + money7 +
        "&money8=" + money8 +
        "&money9=" + money9 +
        "&money10=" + money10+
        "&buy="+buy
      ,
    })
  }

})