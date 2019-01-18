// pages/huodong/dongtaiDetail/dongtaiDetail.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false,
    comments: [],
    loadingMore: false, //是否正在载入更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let jsonStr = decodeURIComponent(options.jsonStr)
    let dongtai = JSON.parse(jsonStr);

    this.setData({
      dongtai: dongtai,
      h_id: options.h_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({ //上拉加载可能触发重复登录
      loadingMore: false,
    })
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtai = self.data.dongtai; //上个页面传过来的信息
    let dt_id = dongtai.d_id;

    buttonClicked = false;
    self.setData({//为了判断是不是自己
      zcode: zcode
    })

    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page=1", false, false, "", "", "", self).then(res => {
      let comments = res.data.data[0].list;
      let pageall = res.data.data[0].pageall; //评论总页数
      let pagenow = res.data.data[0].pagenow; //当前评论页
      let PLcounts = res.data.data[0].PLcounts;
      // let PLcounts = res.data.data[0].PLcounts;
      self.setData({
        comments: comments,
        page: 1,
        pageall: pageall,
        pagenow: pagenow
      })
    })

  },

  /**
   * 输入评论
   */
  inputComment: function(e) {
    this.setData({
      comment_content: e.detail.value //当前评论内容
    })
  },

  /**
   * 发送评论
   */
  sendComment: function() {
    let self = this;
    let comment_content = this.data.comment_content; //当前输入的评论
    let comments = this.data.comments; //当前所有评论
    let dongtai = self.data.dongtai;
    let h_id = self.data.h_id; //资讯ID\
    let dt_id = dongtai.d_id;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    //保存评论内容到服务器
    app.post(API_URL, "action=SaveHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&content=" + comment_content + "&dt_id=" + dt_id, false, false, "", "", "", self).then(res => {

      //自定义一个时时显示的评论对象
      let mycomment = {};
      mycomment.addtime = "1秒前"; //提交时间
      mycomment.content = comment_content; //评论内容
      mycomment.nickname = user.Nickname;
      mycomment.userpic = user.Pic;
      mycomment.from = "保密(开发中)";

      comments.unshift(mycomment)

      self.setData({
        comments: comments,
        mycomment: mycomment,
        currentComment: "", //清空评论
      })

    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let pageall = self.data.pageall;

    if (pageall == undefined) return;
    let page = self.data.page;

    let dongtai = self.data.dongtai;
    let dt_id = dongtai.d_id;

    if (page >= pageall) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多评论 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let comments = self.data.comments;
    page++;

    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page=" + page, false, false, "", "", "", self).then(res => {
      comments = comments.concat(res.data.data[0].list);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function() {
        self.setData({
          page: page,
          loadingMore: false,
          comments: comments,
          loadingText: ""
        })
      }, 200)
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtai = self.data.dongtai;
    let dt_id = dongtai.d_id;

    wx.showNavigationBarLoading() //在标题栏中显示加载


    //获取评论
    app.post(API_URL, "action=getHdDongtaiPL&loginrandom=" + loginrandom + "&zcode=" + zcode + "&dt_id=" + dt_id + "&page=1", false, false, "", "", "", self).then(res => {
      let comments = res.data.data[0].list;
      let pageall = res.data.data[0].pageall;
      let pagenow = res.data.data[0].pagenow;
      let PLcounts = res.data.data[0].PLcounts;

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      self.setData({
        comments: comments,
        page: 1
      })
    })
  },

  /**
   * 赞
   */
  zan: function() {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let dongtai = self.data.dongtai;
    let h_id = self.data.h_id;
    let dtid = dongtai.d_id;

    app.post(API_URL, "action=SaveHdDdongtai_agree&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&dtid=" + dtid, false, false, "", "", "", self).then(res => {
      let pages = getCurrentPages();
      let prepage = pages[pages.length - 2];
      let dongtais = prepage.data.dongtais; //上个页面的动态列表

      for (let i = 0; i < dongtais.length; i++) {
        let predongtai = dongtais[i];
        if (predongtai.d_id == dtid) {
          predongtai.zan = parseInt(predongtai.zan) + 1;
          predongtai.zan_self = 1;
        }
        break;
      }

      dongtai.zan = parseInt(dongtai.zan) + 1;
      dongtai.zan_self = 1;

      wx.showToast({
        icon: 'none',
        title: '称赞成功',
        duration: 3000
      })

      prepage.setData({ //上个页面的动态
        dongtais: dongtais
      })

      self.setData({
        dongtai: dongtai
      })
    })
  },
  /**
   * 切换是否关注
   */
  toogleMark: function(e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let userid = e.currentTarget.dataset.userid;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let dongtai = self.data.dongtai;

    app.post(API_URL, "action=user_gz&loginrandom=" + loginrandom + "&zcode=" + zcode + "&userid=" + userid, false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      if (result) {
        let pages = getCurrentPages();
        let prepage = pages[pages.length-2];
        let dongtais = prepage.data.dongtais;//上个页面的动态信息

        dongtai.guanzhu = dongtai.guanzhu == 0 ? 1 : 0;

        for(let i = 0;i<dongtais.length;i++){//，本页面设置关注后，设置上个页面的动态关注信息，做到返回上个页面后关注同步
          let predongtai = dongtais[i];
          if (predongtai.d_id == dongtai.d_id){
            predongtai.guanzhu = dongtai.guanzhu;
            prepage.setData({
              dongtais: dongtais
            })
            break;
          }
        }

        buttonClicked = false;
        self.setData({
          dongtai: dongtai
        })
        wx.showToast({
          icon: 'none',
          title: dongtai.guanzhu == 0 ? '取消关注成功' : '关注成功',
          duration: 3000
        })
      }
    })
  },

  /**
   * 删除动态
   */
  deleteDongtai: function (e) {
    let self = this;
    let d_id = e.currentTarget.dataset.did;
    let h_id = self.data.h_id;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    wx.showModal({
      title: '提示',
      content: '确定删除动态信息吗?',
      success: (res) => {
        if (res.confirm) {
          app.post(API_URL, "action=DelHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&d_id=" + d_id, false, false, "", "", "", self).then(res => {
            let pages = getCurrentPages();
            let prepage = pages[pages.length - 2];
            let dongtais = prepage.data.dongtais;

            for (let i = 0; i < dongtais.length; i++) { //如果删除接口请求成功就从本地数组中去除，实现实时显示
              let dongtai = dongtais[i];

              if (dongtai.d_id == d_id) {
                dongtais.splice(i, 1);
                prepage.setData({
                  dongtais: dongtais
                })

                wx.navigateBack({})
                wx.showToast({
                  icon: 'none',
                  title: '删除成功',
                  duration: 3000
                })
                break;
              }
            }
          })
        }
      }
    })
  },

  /**
 * 导航到个人主页
 */
  GOuserInfo: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let userid = e.currentTarget.dataset.userid;
    let guanzhu = e.currentTarget.dataset.guanzhu;
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userid=' + userid + "&guanzhu=" + guanzhu,
    })
  }
})