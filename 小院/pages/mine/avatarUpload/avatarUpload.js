Page({
  data: {
    src: '',
    width: 250,//宽度
    height: 250,//高度
  },
  onLoad: function (options) {
    this.cropper = this.selectComponent("#image-cropper");
    this.setData({
      src: options.src,
    });
  },

  cropperload(e) {
    console.log("cropper初始化完成");
  },

  loadimage(e) {
    console.log("图片加载完成", e.detail);
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },

  clickcut(e) {
    console.log(e.detail);
    //点击裁剪框阅览图片
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },

  //重选图片
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.setData({
          src: src,
        });
      }
    })
  },

  //生成图片
  getCropperImage() {
    let self = this;
    this.cropper.returnPath(self);
  },

  //图片回调
  imageCallback:function(res){
    let pages = getCurrentPages();
    let prePage = pages[pages.length-2];
    let userInfo = prePage.data.userInfo;
    userInfo.Pic = res
    console.log(userInfo)
    prePage.setData({
      userInfo: userInfo
    })
    wx.navigateBack({
      
    })
  }
})