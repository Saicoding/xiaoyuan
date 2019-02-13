// pages/huodong/addDongtai/addDongtai.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;
let ce = 0;
let flagnum = 20;//canvas标记数字

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
    if(buttonClicked) return;//如果已经点击一次按钮，就不继续执行
    buttonClicked = true;//如果执行到这里说明已经点击过，就把是否点击设置为真

    let self = this;

    //用户信息,用于接口
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let pics = self.data.pics;//现在的pics数组(图片src地址数组)
    let base64Imgs = self.data.base64Imgs;//现在的base64数组

    self.setData({//设置全部图片是否全部载入完毕，默认没有全部载入完毕
      isLoadedAll:false
    })

    let length = pics.length;//选择图片前已经被选择的图片数量
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
        flagnum++;
        let newBase64Imgs = newTempFilePaths.map(function (res, index) { 
          return {
            id: flagnum+index
          }
        })   
        pics = pics.concat(newTempFilePaths);    
        base64Imgs = base64Imgs.concat(newBase64Imgs);   
        self.setData({
          base64Imgs: base64Imgs,
          pics: pics
        })   

        console.log(base64Imgs)
        for (let i = 0; i < newTempFilePaths.length;i++){//只画新增加的图片
          let tempFilePath = newTempFilePaths[i];
          flagnum +=1;
          self.drawCanvas(newTempFilePaths[i], base64Imgs, length, loginrandom, zcode, newTempFilePaths.length, i);
        }
      }
    })
  },

  /**
   * 缩放图片
   * 参数：
   *      1.tempFilePath 图片路径
   *      2.index 第几章图片
   */
  drawCanvas: function (tempFilePath, base64Imgs, length, loginrandom, zcode,selectedNums,i) {//参数：
    let self = this;

    wx.getImageInfo({
      src: tempFilePath,
      success:res=>{
        let width = res.width;
        let height = res.height;

        var ratio = 2;
        var canvasWidth = res.width
        var canvasHeight = res.height;
        // 保证宽高均在100以内
        while (canvasWidth > 100 || canvasHeight > 100) {
          //比例取整
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio++;
        }

        console.log(canvasWidth + "||" + canvasHeight)
        base64Imgs[i + length].rate = width / height;
        base64Imgs[i + length].width = canvasWidth;
        base64Imgs[i + length].height = canvasHeight;
        self.setData({
          base64Imgs: base64Imgs
        })

        const ctx = wx.createCanvasContext('photo_canvas' + base64Imgs[i + length].id);
        ctx.drawImage(tempFilePath, 0, 0, canvasWidth, canvasHeight);
        ctx.draw();
        //下载canvas图片
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'photo_canvas' + base64Imgs[i + length].id,
            success: function (res1) {
              console.log(res1.tempFilePath)
              wx.getFileSystemManager().readFile({
                filePath: res1.tempFilePath, //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: res3 => { //成功的回调
                console.log('haha')
                  res3.data = encodeURIComponent(res3.data); //需要编码
                  base64Imgs[i + length].type = res1.type;
                  base64Imgs[i + length].base64 = res3.data;
                  base64Imgs[i + length].width = res1.width;
                  base64Imgs[i + length].height = res1.height;
                  if (res1.width > res1.height) {
                    base64Imgs[i + length].long = true
                  }

                  self.setData({//先保存数据
                    base64Imgs: base64Imgs
                  })

                  res3.data = encodeURIComponent(res3.data);//需要编码
                  base64Imgs[i + length].isLoaded = false

                  console.log("action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data)
                  app.post(API_URL, "action=savePic&loginrandom=" + loginrandom + "&zcode=" + zcode + "&Pic=" + res3.data, false, false, "", "", "", self).then(res => {
                    ce++;
                    if (ce >= selectedNums){
                      ce = 0;
                      self.setData({//设置全部图片是否全部载入完毕，默认没有全部载入完毕
                        isLoadedAll: true
                      })
                    }
                    if (res.data.data[0].result == "success") {
                      base64Imgs[i + length].isLoaded = true;
                      base64Imgs[i + length].url = res.data.data[0].pic;//服务器存储的pic名称
                    }

                    self.setData({
                      base64Imgs: base64Imgs
                    })
                  })
                }
              })
            },
            fail: function (error) {
              console.log(error)
            }
          })
        }, 1000)
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

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;
    let h_id = self.data.h_id;
    let images = self.getImgsStr(base64Imgs);//根据图片数组对象得到服务器存储的图片字符串,以逗号分隔

    app.post(API_URL, "action=SaveHdDongtai&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + h_id + "&content=" + content + "&images=" + images,true,false,"发布中","","",self).then(res=>{
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
        obj.zan_self = "0";
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