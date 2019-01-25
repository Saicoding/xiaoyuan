let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";

Page({
  data: {
    src: '',
    width: 250, //宽度
    height: 250, //高度
  },
  onLoad: function(options) {
    this.cropper = this.selectComponent("#image-cropper");
    this.setData({
      src: options.src,
    });
  },

  cropperload(e) {},

  loadimage(e) {
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
  },

  clickcut(e) {
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
  imageCallback: function(pic) {
    let self = this;
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];
    let userInfo = prePage.data.userInfo;
    let user = wx.getStorageSync('user');
    let loginranom = user.Login_random;
    let zcode = user.zcode;

    wx.showLoading({
      title: '设置头像中...',
    })

    wx.getImageInfo({
      src: pic,
      success: function(res) {
        var ctx = wx.createCanvasContext('photo_canvas');
        var ratio = 2;
        var canvasWidth = res.width
        var canvasHeight = res.height;
        // 保证宽高均在200以内
        while (canvasWidth > 200 || canvasHeight > 200) {
          //比例取整
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio++;
        }
        self.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight
        }) //设置canvas尺寸
        ctx.drawImage(pic, 0, 0, canvasWidth, canvasHeight)
        ctx.draw()
        //下载canvas图片
        setTimeout(function() {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            success: function(res1) {
              console.log(res1.tempFilePath)
              wx.getFileSystemManager().readFile({
                filePath: res1.tempFilePath, //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: res3 => { //成功的回调
                  console.log(res3.data)
                  res3.data = encodeURIComponent(res3.data); //需要编码

                  app.post(API_URL, "action=saveHeadPic&loginrandom=" + loginranom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res4 => {
                    wx.hideLoading({})
                    console.log(res4)
                    prePage.setData({
                      userInfo: userInfo
                    })
                    wx.navigateBack({})
                  })
                }
              })
            },
            fail: function(error) {
              console.log(error)
            }
          })
        }, 100)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})