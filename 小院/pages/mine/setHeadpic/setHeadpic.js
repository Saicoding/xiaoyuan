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
    uploadPicText:'上传图片'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '基本资料',
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
    let info = e.currentTarget.dataset.info == undefined ? '未设置' : e.currentTarget.dataset.info;
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
    this.setData({
      text: text
    })
  },

  /**
   * 改变选项
   */
  _changeSelect: function(e) {
    let title = this.singleSelect.data.title;
    let index = e.detail.myindex;

    let datas = [];
    switch (title) {
      case "性别":
        datas = ['未设置', '保密', '男', '女'];
        this.setData({
          sex: datas[index]
        })
        break;
      case "入学年份":
        datas = ['未设置', '2014', '2015', '2016', '2017']
        this.setData({
          year: datas[index]
        })
        break;
      case "学历":
        datas = ['未设置', '中专', '大专', '本科', '硕士', '博士']

        this.setData({
          xueli: datas[index]
        })
        break;
    }
  },

  /**
   * 在model框按了确认按钮
   */
  _confirm: function(e) {
    let title = e.detail.title;
    let text = this.data.text;
    switch (title) {
      case "昵称":
        this.setData({
          nickname: text,
          text: ""
        })
        break;
      case "手机号":
        this.setData({
          phonenum: text,
          text: ""
        })
        break;
      case "学院":
        this.setData({
          xueyuan: text,
          text: ""
        })
        break;
      case "专业":
        this.setData({
          zhuanye: text,
          text: ""
        })
    }
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

    console.log('ok')

    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    self.setData({
      isLoaded: false,
      uploadPicText:'上传中...'
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

                    self.setData({ //先保存数据
                      pic: tempFilePath,
                      base64Img: base64Img,
                      haspic: true,
                    })


                    res3.data = encodeURIComponent(res3.data); //需要编码

                    app.post(API_URL, "action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res => {
                      buttonClicked = false
                      if (res.data.data[0].result == "success") {
                          self.setData({
                            isLoaded: true,                    
                            uploadPicText:"已上传"
                          })
                      }else{
                        wx.showToast({
                          icon:'none',
                          title: '上传失败',
                          duration:3000
                        })
                      }
                    })
                  },
                  fail: function(res4) {
                    console.log(res4)
                  }
                })
              }
            })
          }
        })

      }
    })
  },

  viewImage:function(){
    let pic = this.data.pic;
    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: [pic],// 需要预览的图片http链接列表
      success: function (res) {  
      }
    })
  }
})