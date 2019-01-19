// pages/chat/chat.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();

let time = require('../../common/time.js');
let animation = require('../../common/animate.js');
let myanimation = animation.easeOutAnimation();
let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadingMore:false,
    ifCanScroll: true//设置是否可以滚动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userid = options.userid;
    let headpic = options.headpic;
    let myHeadpic = options.myHeadpic;
    let username = options.username;

    userid = 210637;
    username = "定脉卫";
    headpic = "http://www.chinaplat.com/user/UserHeadImg/178732.jpg";
    myHeadpic = "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKq6blyJAQ87O4N2qhSbaFIaGoqSibItrgLagwd3cLT8dzgiasgJicg2LX5ias1iclel7lvMesbeptafVA/132";

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ececec',
    })

    wx.setNavigationBarTitle({
      title: username,
    })
    this.setData({ //存储上个页面带过来的信息
      userid: userid,
      username: username,
      headpic: headpic,
      myHeadpic: myHeadpic
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;
    this.chatModel = this.selectComponent('#chatModel');
    wx.getSystemInfo({ //得到窗口高度,这里必须要用到异步,而且要等到窗口bar显示后再去获取,所以要在onReady周期函数中使用获取窗口高度方法
      success: function(res) { //转换窗口高度
        let windowHeight = res.windowHeight;
        let windowWidth = res.windowWidth;
        windowHeight = (windowHeight * (750 / windowWidth));
        self.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    buttonClicked = false;
    let self = this;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let toid = self.data.userid;

    app.post(API_URL, "action=getUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + "&page=1", false, false, "", "", "", self).then(res => {
      let chats = res.data.data[0].list;
      let pageall = res.data.data[0].pageall;
      let recordcount = res.data.data[0].recordcount;

      chats = chats.map(res => { //格式化时间
        res.addtime = time.getTimestr(res.addtime);
        return res;
      })

      

      self.setData({
        chats: chats,
        pageall:pageall,
        recordcount: recordcount,
        page:1
      })

      self.setData({
        scrollTop: 10000
      })

    })
  },

  /**
   * 输入文字
   */
  typing: function(e) {
    let butAnimation = animation.scale3(myanimation);
    let text = e.detail.value;
    this.setData({
      text: text,
      butAnimation: butAnimation
    })
  },

  /**
   * 发送信息
   */
  sendMessage: function() {
    buttonClicked = false;
    let self = this;

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let toid = self.data.userid;
    let content = self.data.text;
    let chats = self.data.chats;

    let message = {};
    message.addtime = time.getTimeNow();
    message.content = content;
    message.flag = "0";
    message.laiyuan = "go";

    chats.push(message); //即可添加发送的信息

    self.setData({
      chats: chats,
      value: '',
      scrollTop: 10000
    })

    self.setData({
      scrollTop: 10000
    })

    app.post(API_URL, "action=saveUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + "&content=" + content + "&page=1", false, false, "", "", "", self).then(res => {
      let id = res.data.data[0].id;
      let butAnimation = animation.scale2(myanimation);
      self.setData({
        butAnimation: butAnimation
      })
      setTimeout(res => {
        self.setData({
          text: ''
        })
      }, 250)
    })
  },

  /**
   * 输入框离开焦点时
   */
  blur: function() {
    this.setData({
      scrollTop: 10000
    })
  },

  /**
   * 长按消息时
   */
  showModel: function(e) {
    let windowWidth = this.data.windowWidth//px
    let x = e.detail.x * (750 / windowWidth);
    console.log(x)
    let y = e.detail.y * (750 / windowWidth);
    let id = e.currentTarget.dataset.id;
    this.chatModel.setData({
      x:x,
      y:y
    })
    this.chatModel.showDialog();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 拉到顶部事件
   */
  scrolltoupper:function(){
    let self = this;
    let isLoadingMore = self.data.isLoadingMore;//是否正在载入更多
    if (isLoadingMore) return;//如果正在载入就什么都不做

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let toid = self.data.userid;
    let page = self.data.page;
    let pageall = self.data.pageall;
    let chats = self.data.chats;

    if (page >= pageall) return;//如果到最后一页什么都不做

    page++;

    app.post(API_URL, "action=getUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + "&page="+page, false, false, "", "", "", self).then(res => {
      let newchats = res.data.data[0].list;
      newchats = newchats.map(res => { //格式化时间
        res.addtime = time.getTimestr(res.addtime);
        return res;
      })

      chats = newchats.concat(chats);

      console.log(chats)

      self.setData({
        chats: chats,
        page:page,
      })
    })

  }
})