// pages/huodong/huodongDetail/huodongDetail.js
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huodong: {
      banner: '/imgs/card.jpg',
      title: '小院送福利啦,转发即送哦小院送福利啦,转发即送哦小院送福利啦,转发即送哦小院送福利啦,转发即送哦',
      status: '已结束',
      info: '校园·社团',
      type: '线下',
      price: '免费',
      time: '2017-10-27至2017-11-10 15天可选',
      position: '河北省,秦皇岛市,海港区,建设大街,186号海港区,建设大街,186号海港区,建设大街,186号',
      num: 2,
      over:true,
      from:{
        pic:'/imgs/nv.png',
        name:'小院活动发布'
      },
      fromtype:'院系名称',
      jindu:2,
      dongtais:[
        {
          pic:"/imgs/heart2.png",
          nickname:"超凡入圣",
          time:"刚刚",
          content:"FIFA oneline4要凉,FIFA oneline4要凉,FIFA oneline4要凉,FIFA oneline4要凉,FIFA oneline4要凉,FIFA oneline4要凉,FIFA oneline4要凉,",
          imgs:[
            "/imgs/head.jpg",
            "/imgs/banner1.png",
            "/imgs/banner2.png",
            "/imgs/card.jpg"
          ],
          likeNum: 5
        },
        {
          pic: "/imgs/right.png",
          nickname: "超凡入圣",
          time: "刚刚",
          content: "FIFA oneline4要凉",
          imgs: [
            "/imgs/head.jpg",
            "/imgs/banner1.png",
            "/imgs/banner2.png",
            "/imgs/banner2.png",
            "/imgs/banner2.png",
            "/imgs/card.jpg"
          ],
          likeNum: 100
        },
        {
          pic: "/imgs/right.png",
          nickname: "超凡入圣",
          time: "刚刚",
          content: "FIFA oneline4要凉",
          imgs: [
            "/imgs/head.jpg",
            "/imgs/banner1.png",
            "/imgs/banner2.png", 
            "/imgs/banner2.png",
            "/imgs/card.jpg"
          ],
          likeNum: 500
        },
        {
          pic: "/imgs/right.png",
          nickname: "超凡入圣",
          time: "刚刚",
          content: "FIFA oneline4要凉",
          imgs: [
            "/imgs/head.jpg",
            "/imgs/banner1.png",
          ],
          likeNum: 4
        },
        {
          pic: "/imgs/right.png",
          nickname: "超凡入圣",
          time: "刚刚",
          content: "FIFA oneline4要凉",
          imgs: [
            "/imgs/head.jpg",
            "/imgs/banner1.png",
            "/imgs/card.jpg"
          ],
          likeNum: 5
        }
      ]
    },
    pics: [
      '/imgs/nv.png',
      '/imgs/nan.png',
      '/imgs/pwd.png',
      '/imgs/user.png',
    ],
    barIndex: 0
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
    let self = this;
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

  },

  /**
   * 切换目录时
   */
  changeMulu:function(e){
    let barIndex = e.currentTarget.dataset.index;//点击的barIndex
    let moveData = barIndex == 0 ? animate.moveX(easeOutAnimation, 0) : animate.moveX(easeOutAnimation, 175);//得到动画数据
    this.setData({
      barIndex: barIndex,
      moveData: moveData
    })
  },

  /**
   * 导航到添加动态页面
   */
  GOaddDongtai:function(){
    wx.navigateTo({
      url: '/pages/huodong/addDongtai/addDongtai',
    })
  }
})