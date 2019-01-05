// pages/mine/kaitong/kaitong.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prices: [{
        'text': '每月',
        'num': 168,
        'select': true,
        'bd_top': true,
      },
      {
        'text': '一季度',
        'num': 280,
        'select': false,
        'bd_top': true
      },
      {
        'text': '一年',
        'num': 680,
        'select': false,
        'bd_top': false
      },
    ],
    upBottom: false,
    price: 168,
    infos: [{
        'img': '/imgs/info1.png',
        'text1': '小院所有课程',
        'text2': '海量学习课程全部免费'
      },
      {
        'img': '/imgs/info2.png',
        'text1': '新增课程',
        'text2': '免费享受新增课程'
      },
      {
        'img': '/imgs/info3.png',
        'text1': '最新考试课程',
        'text2': '热门考试课程不等待'
      },
      {
        'img': '/imgs/info4.png',
        'text1': '精选考试题库',
        'text2': '免费享受最新考试题库'
      }
    ],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let Vip = options.Vip == '1' ? '1' : '0';
    let Ktime = options.Ktime ? options.Ktime:'';
    let Jtime = options.Jtime?options.Jtime:'';
    this.setData({
      Vip:Vip,
      Ktime: Ktime,
      Jtime:Jtime
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
    buttonClicked = false;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    //获取价格信息
    app.post(API_URL, 'action=VipInfo&loginrandom=' + loginrandom+'&zcode='+zcode,false,false,"","","",self).then(res=>{
      console.log(res);
    })

    app.post(API_URL, 'action=getUserInfo&loginrandom=' + loginrandom + '&zcode=' + zcode, false, false, "", "", "", self).then(res => {
      let userInfo = res.data.data[0];
      console.log(userInfo);
    })
  },

  /**
   * 改变价格
   */
  change: function(e) {
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;

    let prices = this.data.prices;
    let upBottom = this.data.upBottom;
    switch (index) {
      case 0:
        prices[0].select = true;
        prices[1].select = false;
        prices[2].select = false;
        prices[0].bd_top = true;
        prices[1].bd_top = true;
        prices[2].bd_top = false;
        upBottom = false;
        break;
      case 1:
        prices[0].select = false;
        prices[1].select = true;
        prices[2].select = false;
        prices[0].bd_top = false;
        prices[1].bd_top = true;
        prices[2].bd_top = true;
        upBottom = false;
        break;
      case 2:
        prices[0].select = false;
        prices[1].select = false;
        prices[2].select = true;
        prices[0].bd_top = false;
        prices[1].bd_top = false;
        prices[2].bd_top = true;
        upBottom = true;
        break;
    }

    this.setData({
      prices: prices,
      upBottom: upBottom,
      price: price,
      index: index //当前付费方式
    })
  },

  /**
   * 支付
   */
  pay: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;

    let self = this;
    let type = e.currentTarget.dataset.type; //付款方法
    let index = self.data.index + 1;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    if (type == "yue") {
      console.log("action=BuyVIP&zcode=" + zcode + "&loginrandom=" + loginrandom + "&years=" + index)
      app.post(API_URL, "action=BuyVIP&zcode=" + zcode + "&loginrandom=" + loginrandom + "&years=" + index, false, false, "", "", "", self).then(res => {
        let vip_jtime = res.data.data[0].vip_jtime

        wx.showModal({
          title: '提示',
          content: '恭喜您,充值成功,VIP到期时间' + vip_jtime,
        })
      })
    }
  }
})