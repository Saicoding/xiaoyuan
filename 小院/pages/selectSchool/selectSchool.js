// pages/selectSchool/selectSchool.js
let app = getApp();
let API_URL = "https://xcx2.chinaplat.com/xy/";
let share = require("../../common/share.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoaded: false //是否已经载入完毕，默认没有载入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;

    let loginrandom = options.loginrandom;//上个页面带过来的用户信息
    let zcode = options.zcode;//上个页面带过来的用户信息

    self.setData({
      loginrandom: loginrandom,
      zcode: zcode
    })

    wx.setNavigationBarTitle({
      title: '选择学校',
    })

    let city = app.globalData.userInfo.city; //个人信息在全局变量里面

    app.post(API_URL, "action=getColleage&city=" + city + "&keywords=", false, false, "").then(res => {
      self.processRequest(res);
    })
  },

  /**
   * 根据省市的大写拼音首字母排序
   */
  compare: function(word) {
    return function(a, b) {
      var value1 = share.getNum(a[word]);//根据大写字母得到比较数字
      var value2 = share.getNum(b[word]);
      return value1 - value2;
    }
  },

  /**
   * 输入框输入文字时
   */
  textInput:function(e){
    this.setData({
      schoolWord: e.detail.value
    })
  },

  /**
   * 开始搜索
   */
  search:function(){
    let self = this;
    let schoolWord = this.data.schoolWord;//搜索关键词
    let city = app.globalData.userInfo.city; //个人信息在全局变量里面

    app.post(API_URL, "action=getColleage&city=" + city + "&keywords=" + schoolWord, false, false, "").then(res => {
      self.processRequest(res);
    })
  },

  /**
   * 点击学校绑定
   */
  bindSchool(e){
    let schoolid = e.currentTarget.dataset.schoolid;//学校ID
    let schoolname = e.currentTarget.dataset.schoolname;//学校名称

    let loginrandom = this.data.loginrandom;
    let zcode = this.data.zcode;

    wx.showModal({
      title: '提示',
      content: '确定绑定【' + schoolname+'】',
      success:function(e){
        if(e.confirm){
          app.post(API_URL, "action=saveColleage&loginrandom=" + loginrandom + "&zcode=" + zcode + "&TJcode=" + schoolid).then(res => {
            wx.showModal({
              title: '提示',
              content: '欢迎回家!您已成功选择【' + schoolname +'】,将返回首页。',
              showCancel:false,
              success:function(e){
                //绑定成功后才算真正登录成功
                let pages = getCurrentPages();
                let prePage = pages[pages.length - 2];//上一个页面
                let indexPage = pages[pages.length - 3];//首页
                let user = prePage.data.user;
                user.x_id = schoolid;
                user.colleage = schoolname;
                
                indexPage.setData({//首页设置学校ID
                  user: user
                })

                wx.setStorageSync('user', user);//保存本地user信息
                wx.navigateBack({
                  delta: 2
                })
              }
            })
          })
        }
      }
    })
  },

   /**
   * 处理请求结果
   */
  processRequest: function (res) {
    let self = this;

    self.setData({
      isLoaded: false
    })

    let schoolArray = res.data.list;
    schoolArray = schoolArray.sort(self.compare('word'));
    console.log(schoolArray)

    let lastLetter = "";//上一次的拼音首字母，用于遍历数组时控制字母是否有变化
    let lastIndex = -1;
    let letterSchools = [];//重构的学校数组(根据字母生成的新数组)

    for (let i = 0; i < schoolArray.length; i++) {
      let school = schoolArray[i];
      if (school.word != lastLetter) {//如果字母有变化就新建一个数组
        lastIndex++;
        letterSchools[lastIndex] = [];
        lastLetter = school.word;
      }
      letterSchools[lastIndex].push(school);//往对应字母的数组里添加学校元素
    }

    self.setData({
      letterSchools: letterSchools,
      isLoaded: true
    })
  },
})