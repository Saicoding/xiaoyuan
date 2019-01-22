// pages/huodong/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let lngsAndLats = this.bMapTransQQMap(options.address_x, options.address_y); //腾讯经纬度对象
    this.setData({
      options: options,
      lngsAndLats: lngsAndLats
    })
  },

  bMapTransQQMap: function (lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);

    return {
      lng: lngs,
      lat: lats
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        let statusBarHeight = res.statusBarHeight * (750 / windowWidth);

        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          statusBarHeight: statusBarHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let options = this.data.options;
    let lngsAndLats = this.data.lngsAndLats;

    wx.setNavigationBarTitle({
      title: options.address
    })


    let markers = [{
      id: 0,
      latitude: lngsAndLats.lat,
      longitude: lngsAndLats.lng,
      iconPath: '/imgs/dingwei.png',
      width: '50rpx',
      height: '50rpx',
      callout: {
        content: options.address,
        color: '#ff3c00',
        fontSize: '25rpx',
        bgColor: '#ffffff',
        display: 'ALWAYS',
        padding: '20rpx',
        textAlign: 'BYCLICK',
        borderColor: '#ff3c00',
        borderWidth: '1rpx',
        borderRadius: '12rpx'
      }
    }]

    // let promise = new promise((reject, resolve) => {
    //   let interval = setInterval(res => {
    //     if (self.data.currentLocation) {
    //       resolve(self.data.currentLocation);
    //       clearInterval(interval);
    //     }
    //   }, 100)
    // })

    // promise.then(res => {
    //   console.log(res);
      // let polyline = [
      //   {
      //     points: [{
      //       longitude: res.lng,
      //       latitude: res.lat
      //     }, {
      //       longitude: 113.324520,
      //       latitude: 23.21229
      //     }],
      //     color: '#FF0000DD',
      //     width: 2,
      //     dottedLine: true
      //   }
      // ]
    // })

    this.setData({
      address_x: lngsAndLats.lng,
      address_y: lngsAndLats.lat,
      markers: markers
    })
  },
})