// pages/huodong/addDongtai/addDongtai.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics:[],
    base64Imgs:[],
    isLoadedAll:true,//都已经添加完毕
    hasText:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置标题
    wx.setNavigationBarTitle({
      title: '添加动态',
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
  },

  /**
   * 输入框输入内容
   */
  textInput:function(e){
    this.setData({
      text: e.detail.value
    })
  },

  /**
   * 清除内容
   */
  clear:function(){
    this.setData({
      text:""
    })
  },

  /**
   * 添加图片
   */
  addpic:function(){
    if(buttonClicked) return;
    buttonClicked = true;

    let self = this;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let pics = self.data.pics;//现在的pics数组
    let base64Imgs = self.data.base64Imgs;//现在的base64数组
    let length = pics.length;
    if (base64Imgs.length>=9){
      wx.showToast({
        icon:'none',
        title: '已有9张图片',
        duration:3000
      })
      return
    }

    wx.chooseImage({
      count: 9 - pics.length,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success:function(res){
        let newTempFilePaths = res.tempFilePaths//选择的所有图片
        let newBase64Imgs = newTempFilePaths.map(function (res) { })   
        pics = pics.concat(newTempFilePaths);    
        base64Imgs = base64Imgs.concat(newBase64Imgs);      

        for (let i = 0; i < newTempFilePaths.length;i++){
          let tempFilePath = newTempFilePaths[i];
          //压缩图片
          wx.compressImage({
            src: tempFilePath, // 图片路径
            quality: 10,// 压缩质量
            success:function(res2){
              //获取图片信息
              wx.getImageInfo({
                src: tempFilePath,
                success: function (res1) {
                  wx.getFileSystemManager().readFile({
                    filePath: res1.path, //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: res3 => { //成功的回调
                      base64Imgs[i+length] = {};
                      base64Imgs[i + length].type = res1.type;
                      base64Imgs[i + length].base64 = res3.data;
                      base64Imgs[i + length].width = res1.width;
                      base64Imgs[i + length].height = res1.height;
                      if(res1.width >res1.height){
                        base64Imgs[i].long = true
                      }

                      self.setData({//先保存数据
                        pics: pics,
                        base64Imgs: base64Imgs
                      }) 

                      //模拟进度条
                      let high = 215;
                      base64Imgs[i + length].interval = setInterval(function(){
                        let num = Math.random()*30+1;//生成一个随机数
                        high = high-num;
                        if (high < 15){//在高度为200的时候清除掉interval
                          high = 15
                          clearInterval(base64Imgs[i + length].interval);
                        }
                        base64Imgs[i + length].high = high;
                        self.setData({
                          base64Imgs: base64Imgs
                        })
                      },50)
                      if(i==0){
                        console.log('ok')
                        self.setData({
                          text: res1.type+"action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data
                        })
                      }
                      app.post(API_URL, "action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res => {
                        console.log('有值')
                        console.log(res)
                        clearInterval(base64Imgs[i + length].interval);
                        base64Imgs[i + length].high = 0;
                        
                        let isLoadedAll = true;
                        for (let j = 0; j < base64Imgs.length;j++){
                          if (base64Imgs[j].high !=0){
                            isLoadedAll = false
                          }
                        }
                        self.setData({
                          isLoadedAll: isLoadedAll,
                          base64Imgs: base64Imgs
                        })
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  /**
   * 观看图片
   */
  viewImage:function(e){
    let pics = this.data.pics;//当前所有图片对象,带有宽高
    let url = e.currentTarget.dataset.url;
    let index = url.indexOf(url);

    wx.previewImage({
      current: pics[index], // 当前显示图片的http链接
      urls: pics,// 需要预览的图片http链接列表
      success:function(res){
        console.log(res)
      }
    })
  },

  /**
   * 删除图片
   */
  delete:function(e){
    let self = this;
    let url = e.currentTarget.dataset.url;
    let pics = this.data.pics;
    let base64Imgs = this.data.base64Imgs;
    let index = pics.indexOf(url);

    wx.showModal({
      title: '提示',
      content: '不喜欢该图片?',
      success:function(res){
        if(res.confirm){
          pics.splice(index, 1);
          base64Imgs.splice(index,1);
          console.log()
          self.setData({
            pics: pics,
            base64Imgs: base64Imgs
          })
        }
      }
    })
  },

  /**
   * 提交动态
   */
  submit:function(){
    let self = this;
    let text = self.data.text
    let isLoadedAll = self.data.isLoadedAll;
    if(!isLoadedAll){
      wx.showToast({
        icon:"none",
        title: '还没有载入完毕',
        duration:3000
      })
      return
    }else if(!text){
      wx.showToast({
        icon: "none",
        title: '动态文字不能为空',
        duration: 3000
      })
      return
    }

    let base64s = this.data.base64Imgs;//所有的base64s
    let str = "";//base64数组字符串

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
  }

})