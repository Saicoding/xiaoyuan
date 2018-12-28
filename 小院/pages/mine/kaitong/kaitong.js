// pages/mine/kaitong/kaitong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prices:[
      {'text':'每月',
        'num':168,
        'select':true,
        'bd_top':true,
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
    upBottom:false,
    price:168,
    infos:[
      {
        'img':'/imgs/info1.png',
        'text1':'小院所有课程',
        'text2':'海量学习课程全部免费'
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 改变价格
   */
  change:function(e){
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;

    let prices = this.data.prices;
    let upBottom = this.data.upBottom;
    switch(index){
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
      price:price
    })
  }
})