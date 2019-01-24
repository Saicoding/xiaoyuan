// pages/IM/IMlist/IMlist.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let buttonClicked = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded:false,
    loadingMore: false, //是否在加载更多
    loadingText: "", //上拉载入更多的文字
    showLoadingGif: false, //是否显示刷新gif图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ececec',
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
    buttonClicked = false;
    let self = this;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    self.setData({
      isLoaded:false
    })

    app.post(API_URL,"action=getChatUserList&loginrandom="+loginrandom+"&zcode="+zcode+"&page=1",false,false,"","","",self).then(res=>{
      let chatList = res.data.data;
      let pageall = res.data.pageall;
     
      wx.setNavigationBarTitle({
        title: '小院('+chatList.length+')',
      })
      self.setData({
        chatList:chatList,
        isLoaded: true,
        pageall: pageall,
        page:1
      })
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    app.post(API_URL, "action=getChatUserList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page=1", false, false, "", "", "", self).then(res => {
      let chatList = res.data.data;
      let pageall = res.data.pageall;

      wx.setNavigationBarTitle({
        title: '小院(' + chatList.length + ')',
      })
      self.setData({
        chatList: chatList,
        isLoaded: true,
        pageall: pageall,
        page: 1
      })

      console.log(chatList)

      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let allpage = self.data.pageall;
    let page = self.data.page;

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

    let chatList = self.data.chatList;
    page++;

    app.post(API_URL, "action=getChatUserList&loginrandom=" + loginrandom + "&zcode=" + zcode + "&page="+page, false, false, "", "", "", self).then(res => {
      let newchatList = res.data.data;
      chatList = chatList.concat(newchatList);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          page: page,
          loadingMore: false,
          chatList: chatList,
          loadingText: ""
        })
      }, 200)
    })
  },

  /**
   * 导航到聊天对话框
   */
  GOIM:function(e){
    let user = wx.getStorageSync('user');
    let headpic = e.currentTarget.dataset.headpic;//点击的头像
    let myHeadpic = user.Pic;//我的头像
    let username = e.currentTarget.dataset.username;//点击的用户名

    let toid = e.currentTarget.dataset.toid;//点击的用户id
    wx.navigateTo({
      url: '/pages/IM/IM?userid='+toid+"&headpic="+headpic+"&myHeadpic="+myHeadpic+"&username="+username,
    })
  }

})