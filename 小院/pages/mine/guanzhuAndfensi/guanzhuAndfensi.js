// pages/mine/guanzhuAndfensi/guanzhuAndfensi.js
let app = getApp();
let animate = require('../../../common/animate.js');
let easeOutAnimation = animate.easeOutAnimation();
let easeInAnimation = animate.easeInAnimation();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barIndex: 0, //点击的是活动详情还是活动动态
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let fensi = options.fensi; //如果有值，说明点了粉丝
    if (fensi) {
      let moveData = animate.moveX(easeOutAnimation, 175); //得到动画数据
      this.setData({
        barIndex: 1,
        moveData: moveData
      })
    }
    wx.setNavigationBarTitle({
      title: '关注与粉丝',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this;
    buttonClicked = false;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let barIndex = self.data.barIndex;

    app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=" + barIndex + "&page=1", false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      if (barIndex == 0) { //关注
        let guanzhu_allpage = result.allpage; //关注总页数
        let guanzhu_records = result.records; //关注总数
        let guanzhu_list = result.list; //关注列表
        let guanzhu_page = 1; //关注当前页
        self.setData({
          guanzhu_allpage: guanzhu_allpage,
          guanzhu_records: guanzhu_records,
          guanzhu_list: guanzhu_list,
          guanzhu_page: guanzhu_page,
          guanzhu_first: true //第一次载入
        })
      } else if (barIndex == 1) { //粉丝
        let fensi_allpage = result.allpage; //粉丝总页数
        let fensi_records = result.records; //粉丝总数
        let fensi_list = result.list; //粉丝列表
        let fensi_page = 1; //粉丝当前页

        self.setData({
          fensi_allpage: fensi_allpage,
          fensi_records: fensi_records,
          fensi_list: fensi_list,
          fensi_page: fensi_page,
          fensi_first: true //第一次载入
        })
      }
    })
  },

  /**
   * 切换目录时
   */
  changeMulu: function(e) {
    let self = this;

    let h_id = self.data.h_id;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let barIndex = e.currentTarget.dataset.index; //点击的barIndex

    let moveData = barIndex == 0 ? animate.moveX(easeOutAnimation, 0) : animate.moveX(easeOutAnimation, 175); //得到动画数据
    let guanzhu_first = this.data.guanzhu_first; //关注是否已经载入
    let fensi_first = this.data.fensi_first; //粉丝是否已经载入

    this.setData({
      barIndex: barIndex,
      moveData: moveData
    })

    //如果关注已经载入就不执行
    if (barIndex == 0 && !guanzhu_first) {
      app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=0" + "&page=1", false, false, "", "", "", self).then(res => {
        let result = res.data.data[0];
        let guanzhu_allpage = result.allpage; //关注总页数
        let guanzhu_records = result.records; //关注总数
        let guanzhu_list = result.list; //关注列表
        let guanzhu_page = 1; //关注当前页
        self.setData({
          guanzhu_allpage: guanzhu_allpage,
          guanzhu_records: guanzhu_records,
          guanzhu_list: guanzhu_list,
          guanzhu_page: guanzhu_page,
          guanzhu_first: true //第一次载入
        })
      })
    }

    //如果粉丝已经载入就不执行
    if (barIndex == 1 && !fensi_first) {
      app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=1" + "&page=1", false, false, "", "", "", self).then(res => {
        console.log(res)
        let result = res.data.data[0];
        let fensi_allpage = result.allpage; //粉丝总页数
        let fensi_records = result.records; //粉丝总数
        let fensi_list = result.list; //粉丝列表
        let fensi_page = 1; //粉丝当前页

        self.setData({
          fensi_allpage: fensi_allpage,
          fensi_records: fensi_records,
          fensi_list: fensi_list,
          fensi_page: fensi_page,
          fensi_first: true //第一次载入
        })
      })
    }
  },

  /**
   * 切换是否关注
   */
  toogleMark: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let userid = e.currentTarget.dataset.userid;
    let types = e.currentTarget.dataset.types;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let list = types == 0 ? self.data.guanzhu_list : self.data.fensi_list; //区分类别

    app.post(API_URL, "action=user_gz&loginrandom=" + loginrandom + "&zcode=" + zcode + "&userid=" + userid, false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      if (result) {
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.userid == userid) { //找到点击的人
            item.guanzhu = item.guanzhu == 0 ? 1 : 0;
            buttonClicked = false;
            if (types == 0) {
              self.setData({
                guanzhu_list: list
              })
            } else {
              self.setData({
                fensi_list: list
              })
            }

            wx.showToast({
              icon: 'none',
              title: item.guanzhu == 0 ? '取消关注成功' : '关注成功',
              duration: 3000
            })
            return;
          }
        }
      }
    })
  },

  /**
   * 导航到个人主页
   */
  GOuserInfo: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let userid = e.currentTarget.dataset.userid;
    let guanzhu = e.currentTarget.dataset.guanzhu;
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userid=' + userid + "&guanzhu=" + guanzhu,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行
    let barIndex = self.data.barIndex; //当前bar类别
    let list = barIndex == 0 ? self.data.guanzhu_list : self.data.fensi_list;

    let allpage = barIndex == 0 ? self.data.guanzhu_allpage : self.data.fensi_allpage;
    let page = barIndex == 0 ? self.data.guanzhu_page : self.data.fensi_page;

    if(list.length < 10){
      return;
    }

    if (page >= allpage) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    page++;

    app.post(API_URL, "action=getFans&loginrandom=" + loginrandom + "&zcode=" + zcode + "&types=" + barIndex + "&page=" + page, false, false, "", "", "", self).then(res => {
      let newNews = res.data.data[0].list;
      list = list.concat(newNews);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      if (barIndex == 0){
        setTimeout(function () {
          self.setData({
            guanzhu_page: page,
            loadingMore: false,
            guanzhu_list: list,
            loadingText: ""
          })
        }, 200)
      }else if(barIndex ==1){
        setTimeout(function () {
          self.setData({
            fensi_page: page,
            loadingMore: false,
            fensi_list: list,
            loadingText: ""
          })
        }, 200)
      }
    })

  },

})