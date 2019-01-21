// pages/mine/zhanghuzhongxin/zhanghuzhongxin.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let md5 = require('../../../common/MD5.js');
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '账户中心',
    })

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
    let self = this;
    let user = wx.getStorageSync('user');
    self.setData({
      jifen: user.Jifen,
      xuebi: user.Money
    })
  },

  /**
   * 微信支付输入框
   */
  wxpayInput: function(e) {
    let currentValue = e.detail.value;
    let valueStr = currentValue.toString();
    if (valueStr[0] == '.') { //如果第一个输入的是.
      wx.showToast({
        icon: 'none',
        title: '输入金额错误',
        duration: 3000
      })
      this.setData({
        lastvalue: ''
      })
      return;
    } else if (valueStr.length >= 4 && currentValue < 0.01) { //如果输入金额是一分钱
      let lastvalue = this.data.lastvalue;
      wx.showToast({
        icon: 'none',
        title: '充值金额不能小于0.01元',
        duration: 3000
      })
      this.setData({
        lastvalue: lastvalue
      })
    } else if (valueStr.indexOf('.')<valueStr.length-3) { //如果金额大于4
      let lastvalue = this.data.lastvalue;
      wx.showToast({
        icon: 'none',
        title: '充值金额最小单位为分',
        duration: 3000
      })
      this.setData({
        lastvalue: lastvalue
      })
    } else { //正常赋值
      this.setData({
        lastvalue: currentValue
      })
    }
  },

  /**
   * 导航到积分记录
   */
  GOjifen: function() {
    wx.navigateTo({
      url: '/pages/mine/zhanghuzhongxin/jifenRecord/jifenRecord',
    })
  },

  /**
   * 导航到积分记录
   */
  GOxuebi: function() {
    wx.navigateTo({
      url: '/pages/mine/zhanghuzhongxin/xuebiRecord/xuebiRecord',
    })
  },

  /**
   * 导航到积分记录
   */
  GOxueshi: function() {
    wx.navigateTo({
      url: '/pages/mine/zhanghuzhongxin/xueshiRecord/xueshiRecord',
    })
  },

  /**
   * 支付
   */
  /**
  * 支付
  */
  pay: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;

    let self = this;
    let type = e.currentTarget.dataset.type; //付款方法
    let lastvalue = self.data.lastvalue;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    if (type == "chongzhika") {
      app.post(API_URL, "action=BuyVIP&zcode=" + zcode + "&loginrandom=" + loginrandom + "&years=" + index, false, false, "", "", "", self).then(res => {

        let vip_jtime = res.data.data[0].vip_jtime;
        let vip_ktime = res.data.data[0].vip_ktime;

        wx.showModal({
          title: '提示',
          content: '恭喜您,充值成功,VIP到期时间：' + vip_jtime
        })

        self.setData({ //更新截止时间
          Vip: '1',
          Jtime: vip_jtime,
          Ktime: vip_ktime,
        })
      })
    } else if (type == "wx") {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let code = res.code;
          app.post(API_URL, "action=getSessionKey&code=" + code, true, false, "购买中").then((res) => {
            let openid = res.data.openid;
            app.post(API_URL, "action=unifiedorder&loginrandom=" + loginrandom + "&zcode=" + zcode + "&product=" + lastvalue + "&openid=" + openid, true, false, "购买中").then((res) => {
              let status = res.data.code;
              console.log('ok')
              if (status == "1") {
                let timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                timestamp = timestamp.toString();
                let nonceStr = "TEST";
                let prepay_id = res.data.prepay_id;
                let appId = "wxfc4ecbaf91acfaf6";
                let myPackage = "prepay_id=" + prepay_id;
                let key = "e625b97ae82c3622af5f5a56d1118825";

                let str = "appId=" + appId + "&nonceStr=" + nonceStr + "&package=" + myPackage + "&signType=MD5&timeStamp=" + timestamp + "&key=" + key;
                let paySign = md5.md5(str).toUpperCase();

                let myObject = {
                  'timeStamp': timestamp,
                  'nonceStr': nonceStr,
                  'package': myPackage,
                  'paySign': paySign,
                  'signType': "MD5",
                  success: function (res) {
                    app.post(API_URL,"action=getUserInfo&loginrandom=" + loginrandom + "&zcode=" + zcode,false,false,"","","",self).then(res=>{
                      let xuebi = self.data.xuebi
                      let userInfo = res.data.data[0];
                      self.setData({
                        xuebi: parseFloat(userInfo.Money) + parseFloat(xuebi),
                        lastvalue:''
                      })
                    })
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                }
                wx.requestPayment(myObject)
              }
            })
          })
        }
      })
    }
  }


})