// pages/huodong/baomingList/baomingList.js
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
    wx.setNavigationBarTitle({
      title: '报名列表',
    })

    let h_id = options.h_id;//活动id
    this.setData({
      h_id: h_id
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
    //下拉刷新可能触发重复登录，这时跳转到登录界面时没有停止刷新状态，需要手动设置
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    this.setData({//上拉加载可能触发重复登录
      loadingMore: false
    })

    let self = this;
    buttonClicked = false;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let h_id = this.data.h_id;//活动id

    app.post(API_URL,"action=getActivityUsers_new&loginrandom="+loginrandom+"&zcode="+zcode+"&h_id="+h_id,false,false,"","","",self).then(res=>{
      let result = res.data.data[0];
      console.log(result)
      let baomingList = result.list;
      let allpage = result.allpage;
      let page = result.page;
      let record = result.records;

      self.setData({
        baomingList: baomingList,//报名列表
        zcode: zcode,
        record: record ,
        allpage: allpage,
        page:1,
        isLoaded:true
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
    let h_id = self.data.h_id;

    wx.showNavigationBarLoading() //在标题栏中显示加载

    app.post(API_URL, "action=getActivityUsers_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id, false, false, "", "", "", self).then(res => {
      let result = res.data.data[0];
      let baomingList = result.list;
      let allpage = result.allpage;
      let page = result.page;


      self.setData({
        baomingList: baomingList,//报名列表
        allpage: allpage,
        page: 1
      })

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

    let allpage = self.data.allpage;
    let page = self.data.page;
    let h_id = self.data.h_id;//活动id

    if (page >= allpage) {
      self.setData({ //正在载入
        loadingText: "别扯了,我是有底线的..."
      })
      return;
    }

    self.setData({ //正在载入
      showLoadingGif: true,
      loadingText: "载入更多列表 ..."
    })

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let baomingList = self.data.baomingList;
    page++;

    app.post(API_URL, "action=getActivityUsers_new&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id+"&page="+page, false, false, "", "", "", self).then(res => {
      let newBaomingList= res.data.data[0].list;
      baomingList = baomingList.concat(newBaomingList);

      self.setData({
        showLoadingGif: false,
        loadingText: "载入完成"
      })

      setTimeout(function () {
        self.setData({
          page: page,
          loadingMore: false,
          baomingList: baomingList,
          loadingText: ""
        })
      }, 200)
    })
  },

  /**
   * 切换是否关注
   */
  toogleMark:function(e){
    if(buttonClicked) return;
    buttonClicked = true;
    let self = this;
    let userid = e.currentTarget.dataset.userid;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode= user.zcode;

    let baomingList  = self.data.baomingList;

    app.post(API_URL,"action=user_gz&loginrandom="+loginrandom+"&zcode="+zcode+"&userid="+userid,false,false,"","","",self).then(res=>{
        let result = res.data.data[0];
        if(result){
          for (let i = 0; i < baomingList.length;i++){
            let baoming = baomingList[i];
            if(baoming.userid == userid){//找到点击的人
              baoming.guanzhu = baoming.guanzhu == 0 ?1:0;
              buttonClicked = false;
              self.setData({
                baomingList: baomingList
              })
              wx.showToast({
                icon:'none',
                title: baoming.guanzhu ==0?'取消关注成功':'关注成功',
                duration:3000
              })
              return;
            }
          }
        }
    })
  },

  GOuserInfo:function(e){
    if(buttonClicked) return;
    buttonClicked = true;    
    let userid = e.currentTarget.dataset.userid;

    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userid='+userid,
    })
  }
})