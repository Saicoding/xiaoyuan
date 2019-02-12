//app.js

App({
  onLaunch: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang: "zh_CN",
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    let res = wx.getLaunchOptionsSync(); //用户入口信息

    let str = "";
    switch (res.scene) {
      case 1001:
        str = "发现栏小程序主入口";
        break;
      case 1011:
        str = "扫描二维码";
        break;
      default:
        str = res.scene;
        break;
    }
    console.log('小程序入口:' + str);
    // wx.clearStorage();
  },

  /** 
   * 自定义post函数，返回Promise
   * +-------------------
   * author: Sai<417353147@qq.com>
   * +-------------------
   * @param {String}      url 接口网址
   * @param {arrayObject} data 要传的数组对象 例如: {name: 'Sai', age: 32}
   * +-------------------
   * @return {Promise}    promise 返回promise供后续操作
   */

  //  {
  //   "pagePath": "pages/guangchang/guangchang",
  //   "selectedColor": "#13b7f6",
  //   "iconPath": "/imgs/guangchang1.png",
  //   "selectedIconPath": "/imgs/guangchang2.png",
  //   "color": "#000000",
  //   "text": "广场"
  // },
  post: function(url, data, ifShow, ifCanCancel, title, pageUrl, ifGoPage, self) {
    if (ifShow) {
      wx.showLoading({
        title: title,
        mask: !ifCanCancel
      })
    }

    var promise = new Promise((resolve, reject) => {

      var that = this;
      var postData = data;

      //网络请求
      wx.request({
        url: url,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) { //服务器返回数据
          let status = res.data.code;
          if (status != 1) {
            console.log('异常')
            console.log(res)
          }
          let message = res.data.Message;
          if (status == 1) { //请求成功
            resolve(res);
          } else if (status == -201) { //重复登录
            console.log('重复登录')
            if (self) { //如果传了这个参数
              self.setData({
                isReLoad: true
              })
            }
            wx.navigateTo({
              url: '/pages/login/login?url=' + pageUrl + '&ifGoPage=' + ifGoPage
            })

          } else {
            console.log(status);
            console.log(message);
            wx.showToast({
              icon: 'none',
              title: message,
              duration: 3000
            })
          }

          wx.hideLoading();
        },
        error: function(e) {
          console.log('错误')
          reject('网络出错');
        }
      })
    });
    return promise;
  },

  onError(msg) {
    console.log(msg)
  },

  globalData: {
    userInfo: null
  }
})