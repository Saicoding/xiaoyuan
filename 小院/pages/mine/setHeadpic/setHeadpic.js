// pages/mine/setHeadpic/setHeadpic.js

let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    headpic: '/imgs/icon8.png',
    uploadPicText: '上传图片'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = JSON.parse(options.userInfoStr);
    wx.setNavigationBarTitle({
      title: '基本资料',
    })
    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.myinput = this.selectComponent('#myinput');
    this.singleSelect = this.selectComponent('#singleSelect');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    buttonClicked: false
    let userInfo = this.data.userInfo;
    let uploadPicText = this.data.uploadPicText;
    this.setData({
      random: new Date().getTime()
    })

    if (userInfo.zs_colleage_img) { //如果有图片了，展示框就用此图片

      userInfo.showImage = userInfo.zs_colleage_img
      if (userInfo.rz == '1') {
        uploadPicText = '已认证'
      }
      this.setData({
        userInfo: userInfo,
        pic: userInfo.zs_colleage_img,
        uploadPicText: uploadPicText
      })
    }
  },

  /**
   * 弹出模板
   */
  showModel: function(e) {
    let title = e.currentTarget.dataset.title;
    let placeholder = e.currentTarget.dataset.placeholder;
    let inputtype = e.currentTarget.dataset.inputtype;
    let info = e.currentTarget.dataset.info;
    let value = info ? info : "";

    this.setData({
      title: title,
      placeholder: placeholder
    })

    this.myinput.setData({
      value: value,
      inputtype: inputtype
    })

    this.myinput.showDialog();
  },

  /**
   * 弹出选择窗口
   */
  showSingleSelect: function(e) {
    let title = e.currentTarget.dataset.title;
    let info = !e.currentTarget.dataset.info ? '未设置' : e.currentTarget.dataset.info;
    let datas = [];
    let myindex = [];
    switch (title) {
      case "性别":
        datas = ['未设置', '保密', '男', '女'];
        myindex = datas.indexOf(info);
        this.singleSelect.setData({
          datas: datas,
          title: title,
          myindex: myindex
        })
        break;
      case "入学年份":
        datas = ['未设置', '2014', '2015', '2016', '2017'];
        myindex = datas.indexOf(info);
        this.singleSelect.setData({
          datas: datas,
          title: title,
          myindex: myindex
        })
        break;
      case "学历":
        datas = ['未设置', '中专', '大专', '本科', '硕士', '博士'];
        myindex = datas.indexOf(info);
        this.singleSelect.setData({
          datas: datas,
          title: title,
          myindex: myindex
        })
        break;
    }
    this.singleSelect.showDialog();
  },

  /**
   * 保存输入信息
   */
  _inputText: function(e) {
    let text = e.detail.text; //输入框的内容
    let title = e.detail.title; //输入框的种类

    this.setData({
      text: text,
    })
  },

  /**
   * 改变选项
   */
  _changeSelect: function(e) {
    let title = this.singleSelect.data.title;
    let index = e.detail.myindex;
    let userInfo = this.data.userInfo;

    let datas = [];
    switch (title) {
      case "性别":
        datas = ['未设置', '保密', '男', '女'];
        userInfo.Sex = datas[index]
        break;
      case "入学年份":
        datas = ['未设置', '2014', '2015', '2016', '2017']
        userInfo.ruxue = datas[index]
        break;
      case "学历":
        datas = ['未设置', '中专', '大专', '本科', '硕士', '博士']
        userInfo.xueli = datas[index]
        break;
    }

    this.setData({
      userInfo: userInfo
    })
  },

  /**
   * 在model框按了确认按钮
   */
  _confirm: function(e) {
    let title = e.detail.title;
    let text = this.data.text;
    let userInfo = this.data.userInfo;
    switch (title) {
      case '昵称':
        userInfo.Nicename = text
        break;
      case '手机号':
        userInfo.Mobile = text
        break;
      case '学院':
        userInfo.yuanxi = text
        break;
      case '专业':
        userInfo.zhuanye = text

        break;
    }

    this.setData({
      userInfo: userInfo,
      text: ""
    })
  },

  /**
   * 在model框按了取消按钮
   */
  _cancel: function(e) {
    this.setData({
      text: ""
    })
  },

  /**
   * 上传图片
   */
  upLoadImg: function() {
    if (buttonClicked) return;
    buttonClicked = true;
    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let userInfo = self.data.userInfo;

    if (userInfo.rz != '') { //如果已经认证就返回
      wx.showToast({
        icon: 'none',
        title: '已认证,无法更改',
        duration: 3000
      })
      return;
    }

    self.setData({
      isLoaded: false,
      uploadPicText: '上传中...'
    })

    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: function(res) {

        let tempFilePath = res.tempFilePaths[0] //选择的图片
        let base64Img = {};
        //压缩图片
        wx.compressImage({
          src: tempFilePath, // 图片路径
          quality: 30, // 压缩质量
          success: function(res2) {
            //获取图片信息
            wx.getImageInfo({
              src: tempFilePath,
              success: function(res1) {
                wx.getFileSystemManager().readFile({
                  filePath: res1.path, //选择图片返回的相对路径
                  encoding: 'base64', //编码格式
                  success: res3 => { //成功的回调
                    base64Img.base64 = res3.data;
                    base64Img.type = res1.type;
                    base64Img.width = res1.width;
                    base64Img.height = res1.height;
                    if (res1.width > res1.height) {
                      base64Img.long = true
                    }

                    userInfo.showImage = tempFilePath //展示用图片

                    self.setData({ //先保存数据
                      base64Img: base64Img,
                      haspic: true,
                    })


                    res3.data = encodeURIComponent(res3.data); //需要编码

                    app.post(API_URL, "action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res => {
                      buttonClicked = false
                      if (res.data.data[0].result == "success") {
                        userInfo.zs_colleage_img = res.data.data[0].pic //存储用参数
                        userInfo.showImage = res.data.data[0].pic
                        self.setData({
                          isLoaded: true,
                          userInfo: userInfo,
                          uploadPicText: "已上传"
                        })
                      } else {
                        wx.showToast({
                          icon: 'none',
                          title: '上传失败',
                          duration: 3000
                        })
                      }
                    })
                  },
                  fail: function(res4) {

                  }
                })
              }
            })
          }
        })

      },
      fail: function() {
        buttonClicked = false
      }
    })
  },

  /**
   * 产看图片
   */
  viewImage: function() {
    let pic = this.data.pic;
    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: [pic], // 需要预览的图片http链接列表
      success: function(res) {}
    })
  },

  /**
   * 保存信息
   */
  save: function() {
    let self = this;
    if (buttonClicked) return;
    buttonClicked = true;
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let userInfo = self.data.userInfo;

    let nickname = userInfo.Nicename;
    let sex = userInfo.Sex;
    let mobile = userInfo.Mobile;
    let zs_yuanxi = userInfo.yuanxi;
    let zs_professional = userInfo.zhuanye;
    let zs_ruxue = userInfo.ruxue;
    let zs_edution = userInfo.xueli;
    let zs_colleage_img = userInfo.zs_colleage_img;

    app.post(API_URL, "action=saveUserInfo" +
      "&loginrandom=" + loginrandom +
      "&zcode=" + zcode +
      "&nickname=" + nickname +
      "&sex=" + sex +
      "&mobile=" + mobile +
      "&zs_yuanxi=" + zs_yuanxi +
      "&zs_professional=" + zs_professional +
      "&zs_ruxue=" + zs_ruxue +
      "&zs_edution=" + zs_edution +
      "&zs_colleage_img=" + zs_colleage_img, true, true, "保存中", "", "", self).then(res => {
      buttonClicked = false;
      wx.showToast({
        icon: 'none',
        title: '保存成功',
        duration: 3000
      })
    })
  },

  /**
   * 导航到设置头像页面
   */
  GOavatarUpload: function() {
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success: function(res) {
        const src = res.tempFilePaths[0]

        wx.navigateTo({
          url: `/pages/mine/avatarUpload/avatarUpload?src=${src}`
        })
      },
      fail: function() {
        buttonClicked = false
      }
    })
  }
})