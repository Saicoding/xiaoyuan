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
    isLoadingMore: false,
    ifCanScroll: true, //设置是否可以滚动
    toView:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userid = options.userid;
    let headpic = options.headpic;
    let myHeadpic = options.myHeadpic;
    let username = options.username;

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
      console.log(chats)
      let pageall = res.data.data[0].pageall;
      let recordcount = res.data.data[0].recordcount;

      chats = chats.map(res => { //格式化时间
        res.addtime = time.getTimestr(res.addtime);
        return res;
      })



      self.setData({
        chats: chats,
        pageall: pageall,
        recordcount: recordcount,
        page: 1
      })

      self.setData({
        scrollTop: 10000
      })

      let interval = setInterval(res => {
        app.post(API_URL, "action=getUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + '&page=1&newchat=yes', false, false, "", "", "", self).then(res => {
          let newchats = res.data.data[0].list; //请求的新消息
          console.log(newchats)
          let chats = self.data.chats; //当前消息

          if (newchats.length > 0) { //有消息时才执行
            newchats = newchats.map(res1 => { //格式化时间
              res1.addtime = time.getTimestr(res1.addtime);
              return res1;
            })

            chats = chats.concat(newchats); //连接当前聊天信息和新消息数组
            console.log(chats)

            self.setData({
              chats: chats,
            })

            self.setData({ //滚动到最下面
              scrollTop: 10000
            })
          }

        })
      }, 3000)

      self.setData({//存储定时器
        interval: interval
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
   * 生命周期事件
   */
  onHide: function() {
    clearInterval(this.data.interval);
  },

  /**
   * 生命周期事件
   */
  onUnload: function() {
    clearInterval(this.data.interval);
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
      // focus:true,//点击发送按钮后聚焦键盘，否则会失去焦点
      chats: chats,
      value: '',
      scrollTop: 10000
    })

    self.setData({
      scrollTop: 10000
    })

    app.post(API_URL, "action=saveUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + "&content=" + content + "&page=1", false, false, "", "", "", self).then(res => {
      let id = res.data.data[0].id;
      chats[chats.length - 1].id = id;
      let butAnimation = animation.scale2(myanimation);
      self.setData({
        butAnimation: butAnimation,
        chats: chats,
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
    let windowWidth = this.data.windowWidth //px
    let x = e.detail.x * (750 / windowWidth);
    console.log(x)
    let y = e.detail.y * (750 / windowWidth);
    let id = e.currentTarget.dataset.id;
    this.chatModel.setData({
      x: x,
      y: y
    })
    this.chatModel.showDialog();
    this.setData({
      longtapId: id
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 撤回某条信息
   */
  _chehui: function() {
    let self = this;
    let longtapId = this.data.longtapId;
    let user = wx.getStorageSync("user");
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let chats = self.data.chats;

    console.log("action=chehuiChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + longtapId)
    app.post(API_URL, "action=chehuiChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + longtapId, true, false, "正在撤回", "", "", self).then(res => {
      for (let i = 0; i < chats.length; i++) {
        let chat = chats[i];
        console.log(chat)
        if (chat.id == longtapId) { //如果撤回成功，本地删除该元素
          let index = chats.indexOf(chat);
          if (index > -1) {
            chats.splice(index, 1); //撤回成功后去除这条聊天
            let obj = {}; //模拟撤回聊天对象
            obj.addtime = time.getTimeNow();
            obj.content = chat.content;
            obj.chehui = true;
            chats.push(obj); //添加撤回这个对象用户显示
            self.setData({
              chats: chats
            })
            return;
          }
        }

      }
    })
  },

  /**
   * 重新编辑
   */
  reEdit: function(e) {
    let self = this;
    let text = e.currentTarget.dataset.text; //点击重新编辑的
    this.setData({
      value: text,
      focus: true //聚焦键盘
    })

  },

  /**
   * 删除某条信息
   */
  _delete: function() {
    let self = this;
    let longtapId = this.data.longtapId;
    let user = wx.getStorageSync("user");
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let chats = self.data.chats;

    wx.showModal({
      content: '确认删除',
      confirmColor: 'red',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          for (let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            if (chat.id == longtapId) {
              let index = chats.indexOf(chat);
              if (index > -1) {
                chats.splice(index, 1);
                self.setData({
                  chats: chats
                })
                app.post(API_URL, "action=deleteChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&id=" + longtapId, false, false, "", "", "", self).then(res => {
                  console.log(res)
                })
                return;
              }
            }
          }
        }
      }
    })
  },

  /**
   * 拉到顶部事件
   */
  scrolltoupper: function() {
    let self = this;
    let isLoadingMore = self.data.isLoadingMore; //是否正在载入更多

    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let toid = self.data.userid;
    let page = self.data.page;
    let pageall = self.data.pageall;
    let chats = self.data.chats;

    if (page >= pageall) return; //如果到最后一页什么都不做

    self.setData({//设置正在载入更多
      isLoadingMore: true
    })
    if (isLoadingMore) {
      return; //如果正在载入就什么都不做
    }

    page++;

    app.post(API_URL, "action=getUserChat&loginrandom=" + loginrandom + "&zcode=" + zcode + "&toid=" + toid + "&page=" + page, false, false, "", "", "", self).then(res => {
      let newchats = res.data.data[0].list;

      newchats = newchats.map(res => { //格式化时间
        res.addtime = time.getTimestr(res.addtime);
        return res;
      })

      chats = newchats.concat(chats);

      self.setData({
        chats: chats,
        page: page,
        isLoadingMore:false
      })

      self.setData({
        toView: 'c' + newchats.length
      })
    })

  },

})