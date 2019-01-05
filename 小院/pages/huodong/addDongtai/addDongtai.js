// pages/huodong/addDongtai/addDongtai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置标题
    wx.setNavigationBarTitle({
      title: '添加动态',
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
   * 输入框输入内容
   */
  textInput:function(e){
    this.setData({
      text: e.detail.value
    })
  },

  /**
   * 清除内容
   */
  clear:function(){
    this.setData({
      text:""
    })
  },

  /**
   * 添加图片
   */
  addpic:function(){
    let self = this;
    wx.chooseImage({
      count:9,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success:function(res){
        let tempFilePaths = res.tempFilePaths
        self.setData({
          pics: tempFilePaths
        })
      }
    })
  },

  /**
   * 观看图片
   */
  viewImage:function(e){
    let pics = this.data.pics;//当前所有图片
    let current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: pics,// 需要预览的图片http链接列表
      success:function(res){
        console.log(res)
      }
    })
  },

  /**
   * 删除图片
   */
  delete:function(e){
    let self = this;
    let index = e.currentTarget.dataset.index;
    let pics = this.data.pics;
    wx.showModal({
      title: '提示',
      content: '不喜欢该图片?',
      success:function(res){
        if(res.confirm){
          pics.splice(index, 1);
          self.setData({
            pics:pics
          })
        }

      }
    })
  }

})