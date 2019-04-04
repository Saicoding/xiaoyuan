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

  /**
* 生命周期函数
*/
  onReady: function () {
    let self = this;
    //获得dialog组件
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function (res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let platform = res.platform;
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          platform: platform
        })
      }
    });
  },

  cropperload(e) {

  },

  loadimage(e) {
    //重置图片角度、缩放、位置
    this.cropper.imgReset();
    //点击裁剪框阅览图片
    if (e.detail.url){
      wx.previewImage({
        current: e.detail.url, // 当前显示图片的http链接
        urls: [e.detail.url] // 需要预览的图片http链接列表
      })
    }
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
    let windowWidth = self.data.windowWidth;

    wx.showLoading({
      title: '设置头像中...',
    })

    wx.getImageInfo({
      src: pic,
      success: function(res) {
        var ctx = wx.createCanvasContext('photo_canvas');
        ctx.drawImage(pic, 0, 0, 120 * windowWidth / 750, 120 * windowWidth / 750);
        ctx.draw(true, function (res) {
          //下载canvas图片
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas',
            success: function (res1) {
              wx.getFileSystemManager().readFile({
                filePath: res1.tempFilePath, //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: res3 => { //成功的回调
                  res3.data = encodeURIComponent(res3.data); //需要编码
                  app.post(API_URL, "action=saveHeadPic&loginrandom=" + loginranom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res4 => {
                    wx.hideLoading({})
                    prePage.setData({
                      userInfo: userInfo
                    })
                    wx.navigateBack({})
                  })
                }
              })
            },
            fail: function (error) {
              console.log(error)
            }
          })
        })

      },
      fail: function(error) {
        console.log(error)
      }
    })
  }
})