// pages/index/markCourse/markCourse.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";

let buttonClicked = false; //默认还没有点击可以导航页面的按钮

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订阅课程',
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
    let self = this;
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    self.setData({
      isLoaded: false
    })

    /**
     * 请求定制列表
     */
    app.post(API_URL, "action=getCourseTypes_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&myself=0", false, false, "", "", "", self).then(res => {
      let types = res.data.data;
      self.setData({
        isLoaded: true,
        types:types
      })
    })
  },

  changeSelected:function(e){
    let self = this;
    let user = wx.getStorageSync('user'); //先看下本地是否有用户信息，如果有信息说明已经登录
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let types = self.data.types;
    let tidx = e.currentTarget.dataset.tidx;
    let iIdx = e.currentTarget.dataset.iidx;
    let id = e.currentTarget.dataset.id;
    let typesids = "";

    types[tidx].list[iIdx].selected = types[tidx].list[iIdx].selected == "0"?"1":"0";

    for(let i = 0;i<types.length;i++){//得到所有已经选择的数组
      let t = types[i];
      for(let j = 0 ;j<t.list.length;j++){
        let item = t.list[j];
        if(item.selected == "1"){
          typesids+=item.id+",";
        }
      }
    }

    typesids = typesids.substring(0, typesids.length - 1) 

    self.setData({
      types: types
    })

    app.post(API_URL, "action=saveCourseTypes&loginrandom=" + loginrandom + "&zcode=" + zcode + "&typesids=" + typesids, false, false, "", "", "", self).then((res)=>{
      //如果重新设置，在返回页面时重新载入信息
      let pages = getCurrentPages();
      let prePage = pages[pages.length-2];
      prePage.setData({
        isSet:true
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})