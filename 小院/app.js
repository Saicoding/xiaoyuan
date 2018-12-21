//app.js
App({
  onLaunch: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            lang:"zh_CN",
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

    // wx.clearStorage();
  },

  /** 
   * 自定义post函数，返回Promise
   * +-------------------
   * author: 武当山道士<912900700@qq.com>
   * +-------------------
   * @param {String}      url 接口网址
   * @param {arrayObject} data 要传的数组对象 例如: {name: '武当山道士', age: 32}
   * +-------------------
   * @return {Promise}    promise 返回promise供后续操作
   */
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
        console.log(res)
          let status = res.data.code;
          let message = res.data.Message;
          if (status == 1) { //请求成功
            resolve(res);
          } else if (status == -2) { //
            wx.showToast({
              icon:'none',
              title: message,
              duration:3000
            })
          } else if (status == -201) { //重复登录
            console.log('重复登录')
            if (self) {//如果传了这个参数
              self.setData({
                isReLoad: true
              })
            }
            wx.navigateTo({
              url: '/pages/login/login?url=' + pageUrl + '&ifGoPage=' + ifGoPage
            })
          } else if (status ==  2011){
            console.log('没有院校,需要绑定院校');
            wx.showToast({
              icon: 'none',
              title: message,
              duration: 3000
            })
          } else if (status == -5){
            console.log('找回密码不存在')
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

  globalData: {
    userInfo: null
  }
})