// pages/huodong/enlist/enlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dates:[
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03',
      '2018-02-03'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报名信息',
    })
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
   * 点击了下一步
   */
  next:function(){
    wx.showModal({
      title: '提示',
      content: '恭喜您成功报名本次活动,可以在个人中心我的活动中查看订单',
      success:function(res){
        if(res.confirm){
          wx.navigateBack({})
          wx.navigateTo({
            url: '/pages/mine/huodong/huodong',
          })
        }
      }
    })
  }

})