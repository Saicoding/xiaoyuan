// pages/userInfo/userInfo.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
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
  onLoad: function(options) {
    let userid = options.userid;
    let guanzhu = options.guanzhu == 'undefined' ? 0 : options.guanzhu;
    this.setData({
      userid: userid,
      guanzhu:guanzhu
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
    buttonClicked = false;
    let self = this;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode =user.zcode;
    let myHeadpic = user.Pic;
    let userid = self.data.userid;//当前查看用户的id

    self.setData({
      zcode: zcode,
      myHeadpic: myHeadpic
    })

    //个人信息
    app.post(API_URL,"action=getUserIndexInfo&loginrandom="+loginrandom+"&zcode="+zcode+"&userid="+userid,false,false,"","","",self).then(res=>{
      let userInfo = res.data.data[0];
      self.setData({
        userInfo:userInfo
      })
    })

    //获取定制课程信息
    app.post(API_URL, "action=getUserKcTypes&userid=" + userid, false, false, "", "", "", self).then(res => {
      let dingzhiList = res.data.data;
      self.setData({
        dingzhiList: dingzhiList
      })
    })

    //获取动态信息
    app.post(API_URL, "action=getUserDongtai&userid=" + userid+"&page=1", false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      let dongtaiList = result.list;
      dongtaiList = dongtaiList.map(dongtai=>{
        dongtai.pic = dongtai.pic.substr(0, 1) == "," ? dongtai.pic.substr(1) : dongtai.pic.substr;
        dongtai.time = dongtai.addtime.split(' ');
        dongtai.time1 = dongtai.time[0];
        dongtai.time2 = dongtai.time[1];
        return dongtai
      })
   
      let pageall = result.pageall;
      self.setData({
        dongtaiList: dongtaiList,
        pageall: pageall,
        page:1
      })
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
  onReachBottom: function () {
    let self = this;
    let loadingMore = self.data.loadingMore;
    if (loadingMore) return; //如果还在载入中,就不继续执行

    let allpage = self.data.pageall;
    let page = self.data.page;
    let userid = self.data.userid;

    if (page >= allpage) {
      self.setData({ //正在载入
        loadingText: "------------别扯了,我是有底线的------------"
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多资讯 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let dongtaiList = self.data.dongtaiList;
    page++;

    app.post(API_URL, "action=getUserDongtai&userid=" + userid + "&page="+page, false, false, "", "", "", self).then(res => {
      let newDongtaiList = res.data.data[0].list;
      newDongtaiList = newDongtaiList.map(dongtai => {
        dongtai.pic = dongtai.pic.substr(0, 1) == "," ? dongtai.pic.substr(1) : dongtai.pic.substr;
        dongtai.time = dongtai.addtime.split(' ');
        dongtai.time1 = dongtai.time[0];
        dongtai.time2 = dongtai.time[1];
        return dongtai
      })
      dongtaiList = dongtaiList.concat(newDongtaiList);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          page: page,
          loadingMore: false,
          dongtaiList: dongtaiList,
          loadingText: ""
        })
      }, 200)
    })
  },

  /**
  * 切换是否关注
  */
  toogleMark: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let userid = self.data.userid;
    let user = wx.getStorageSync('user');
    let guanzhu = self.data.guanzhu;
    let userInfo = self.data.userInfo;
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    app.post(API_URL, "action=user_gz&loginrandom=" + loginrandom + "&zcode=" + zcode + "&userid=" + userid, false, false, "", "", "", self).then(res => {
      buttonClicked = false;
      let result = res.data.data[0];
      if (result) {
        guanzhu = guanzhu == 0 ? 1:0;
        userInfo.num_fans = guanzhu == 0 ? userInfo.num_fans - 1 : userInfo.num_fans + 1;//实时更新关注信息
        let pages = getCurrentPages();
        let prepage = pages[pages.length-2];
        if (prepage.data.imDetail){//如果上一页面是详情页
          let dongtais = prepage.data.dongtais;
          for(let i = 0;i<dongtais.length;i++){
            let dongtai = dongtais[i];
            if (dongtai.userid == userid){
              dongtai.guanzhu = guanzhu;
              prepage.setData({
                dongtais:dongtais
              })
              break;
            }
          }
        }



        self.setData({
          guanzhu: guanzhu,
          userInfo: userInfo
        })
        wx.showToast({
          icon: 'none',
          title: guanzhu == 0 ? '取消关注成功' : '关注成功',
          duration: 3000
        })

      }
    })
  },

  /**
   * 导航到课程详情
   */
  GOkedetail: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let kc_id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/index/keDetail/keDetail?kc_id=' + kc_id + "&title=" + title,
    })
  },

  /**
  * 查看课程所有列表
  */
  GOViewAll: function (e) {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let typesid = e.currentTarget.dataset.typesid ? e.currentTarget.dataset.typesid : "";
    let buy = e.currentTarget.dataset.buy ? e.currentTarget.dataset.buy : "";
    let favorite = e.currentTarget.dataset.favorite ? e.currentTarget.dataset.favorite : "";
    let Keywords = self.data.Keywords ? self.data.Keywords : "";
    let title = e.currentTarget.dataset.title ? e.currentTarget.dataset.title : "";
    let search = e.currentTarget.dataset.search;

    wx.navigateTo({
      url: "/pages/index/viewAll/viewAll?typesid=" + typesid + "&buy=" + buy + "&favorite=" + favorite + "&Keywords=" + Keywords + "&title=" + title + "&search=" + search
    })
  },

  /**
   * 导航到发私信
   */
  GOchat:function(e){
    let userid = e.currentTarget.dataset.userid;//聊天人的id
    let username = e.currentTarget.dataset.username;//名字
    let headpic = e.currentTarget.dataset.headpic;//头像
    let myHeadpic = this.data.myHeadpic;
    wx.navigateTo({
      url: '/pages/IM/IM?userid=' + userid + "&username=" + username + "&headpic=" + headpic + "&myHeadpic=" + myHeadpic,
    })
  }

})