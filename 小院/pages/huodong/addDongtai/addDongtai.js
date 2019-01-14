// pages/huodong/addDongtai/addDongtai.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;
let ce = 0;

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
    console.log(wx.getStorageSync('user'))
    // 设置标题
    wx.setNavigationBarTitle({
      title: '添加动态',
    })
    this.setData({
      h_id: options.h_id
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
    let num = 0;

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let pics = self.data.pics;//现在的pics数组
    let base64Imgs = self.data.base64Imgs;//现在的base64数组

    self.setData({
      isLoadedAll:false
    })

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
                      ce++;
                      console.log(base64Imgs);
                      console.log(ce)
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


                      res3.data = encodeURIComponent(res3.data);//需要编码
                      base64Imgs[i + length].isLoaded = false
                      console.log("action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data)
                      app.post(API_URL, "action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res => {
                        console.log('进来了')
                        if(res.data.data[0].result == "success"){
                          base64Imgs[i + length].isLoaded = true;
                          base64Imgs[i + length].url = res.data.data[0].pic;//服务器存储的pic名称
                          num++;
                          if (num >= newTempFilePaths.length){
                            self.setData({
                              isLoadedAll: true
                            })
                          }
                        }
                       
                                    
                        self.setData({
                          base64Imgs: base64Imgs
                        })
                      })
                    },
                    fail:function(res4){
                      console.log(res4)
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
    let index = pics.indexOf(url);
    console.log(url)
    console.log(index)
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

    pics.splice(index, 1);
    base64Imgs.splice(index, 1);
    console.log()
    self.setData({
      pics: pics,
      base64Imgs: base64Imgs
    })
  },

  /**
   * 提交动态
   */
  submit:function(){
    let self = this;
    let content = self.data.text;
    let isLoadedAll = self.data.isLoadedAll;
    if(!isLoadedAll){
      wx.showToast({
        icon:"none",
        title: '还没有载入完毕',
        duration:3000
      })
      return
    } else if (!content){
      wx.showToast({
        icon: "none",
        title: '动态文字不能为空',
        duration: 3000
      })
      return
    }

    let base64Imgs = this.data.base64Imgs;//所有的base64s
    let imgs = base64Imgs.map(res=>{//模拟服务器图片数组
      return "http://neuq.chinaplat.com/app_pic/"+res.url
    })
    console.log(imgs)
    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let h_id = self.data.h_id;
    let images = self.getImgsStr(base64Imgs);//根据图片数组对象得到服务器存储的图片字符串,以逗号分隔

    app.post(API_URL, "action=SaveHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&content=" + content + "&images=" + images,true,false,"发布中","","",self).then(res=>{
      console.log(res)
      if(res.data.Message == '成功发布'){
        let pages = getCurrentPages();
        let prePage = pages[pages.length-2];
        let dongtais = prePage.data.dongtais;
        let obj = {};//模拟动态对象
        obj.addtime = "刚刚";
        obj.content = content;
        obj.d_id = res.data.data[0].id;
        obj.guanzhu = "0",
        obj.images = imgs;
        obj.userid = zcode;
        obj.userimg = user.Pic;
        obj.username = user.Nickname;
        obj.zan = "0";
        console.log(dongtais)
        dongtais.unshift(obj);
        console.log(dongtais)
        prePage.setData({
          dongtais: dongtais
        })

        console.log(prePage)
        wx.navigateBack({})//返回上一页面

        wx.showToast({
          icon:'none',
          title: '发布成功',
          duration:3000
        })
      }
    })
  },

  /**
   * 根据图片数组对象得到服务器存储的图片字符串,以逗号分隔
   */
  getImgsStr: function (base64Imgs){
    let str = "";
    for(let i=0;i<base64Imgs.length;i++){
      let url = base64Imgs[i].url;
      str += url+",";
    }
    str = str.substr(0, str.length - 1);  
    return str;
  }

})