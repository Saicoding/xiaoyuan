// pages/huodong/enlist/enlist.js
let API_URL = "https://xcx2.chinaplat.com/xy/";
let app = getApp();
let buttonClicked = false;
let time = require('../../../common/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let mydates = options.hddate = options.hddate.substring(0, options.hddate.lastIndexOf(',')).split(",");//处理日期字符串

    let dates = this.initDate(mydates);//初始化日期信息

    let taocans = [];
    let moneys = [];
    options.money2 = "39.89";
    options.money3 = "39.89";
    options.money4 = "69.19";
    options.money5 = "29.59";
    moneys.push(options.money, options.money2, options.money3, options.money4, options.money5, options.money6, options.money7, options.money8, options.money9, options.money10);//生成套餐价格数组

    for(let i = 0;i<moneys.length;i++){
      if(moneys[i] != ".00"){
        taocans.push({'money':moneys[i]});
      }
    }

    taocans[0].selected = true;


    wx.setNavigationBarTitle({
      title: '报名信息',
    })
    this.setData({
      options: options,
      dates: dates,//日期对象数组
      mydates: mydates,//日期数组
      taocans: taocans,//套餐数组
      lastTaocanIndex:0
    })
  },

  /**
   * 初始化日期信息
   */
  initDate:function(mydates){
    let dates = [];
    let select = false;
    for(let i= 0;i<mydates.length;i++){
      let date = mydates[i];
      let obj = {};
      obj.gone = time.ifGone(date);//日期和当前日期的比较状态
      if(!select && obj.gone == 2){//如果还没有默认选择
        obj.selected = true;
        select = true;
        this.setData({
          dateIndex:i
        })
      }
      //根据日期状态得到背景颜色状态
      this.getCssBydate(obj);
      dates.push(obj);
    }
    return dates;
  },

  /**
   * 根据日期状态得到背景样式
   */
  getCssBydate:function(obj){
    if(obj.gone == 0){//过时了
      obj.style ="background: linear-gradient(to bottom, #eee, #dbdbdb, #eee);border:1rpx solid white; color: rgb(139, 139, 139);";
    } else if (obj.gone == 1){//当天
      obj.style = "background: white;border:1rpx solid rgb(66, 235, 0);color:rgb(66, 235, 0);";
    }else{
      obj.style = "background: white;border:1rpx solid rgb(223, 223, 223);color:black";
    }

    if(obj.selected){
      obj.style = "background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNTIzOERDNDEyM0UxMUU5QUY2OUU1QUYyQjM3QUMwRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNTIzOERDNTEyM0UxMUU5QUY2OUU1QUYyQjM3QUMwRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkI1MjM4REMyMTIzRTExRTlBRjY5RTVBRjJCMzdBQzBFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI1MjM4REMzMTIzRTExRTlBRjY5RTVBRjJCMzdBQzBFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoKDBAMDAwMDAwQDA4PEA8ODBMTFBQTExwbGxscHx8fHx8fHx8fHwEHBwcNDA0YEBAYGhURFRofHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8f/8AAEQgAcQDIAwERAAIRAQMRAf/EAKcAAQACAgMBAAAAAAAAAAAAAAAGBwUIAQIEAwEBAAIDAQEAAAAAAAAAAAAAAAUGAQQHAwIQAAEDAgMFBQUHAQkBAAAAAAEAAgMEBREhBjFhcRIHQVEiExSRoTJCI7FSYnKCY3Oy8IHhojMkdBU1NhEAAQMCAgYIBQIGAwAAAAAAAAECAxEEIgUhMUFREgbwcYGhscHR4WGRMkJS8WKSEzMUJDRygiP/2gAMAwEAAhEDEQA/ANqUAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEBw5zWtLnENa0YuccgAO0oiVMKtDlDIQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQEa1Z1B09pphZUy+fX4YsoISHSHHYXdjBvd71JWOVzXC1alG/kur3I2+zWG2TEtXbk1+xSereomodSudFPJ6W3Y+GggJDCP3HbZDxy3K5WOVQ2+lE4n/kvluKRf5xNcaFXhZuTz3myK52dJCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIDw3m+WmzUbqy51LKaBuxzzm49zWjxOO4L3t7aSZ3CxKqeFxcxwt4nrRCntX9ZrnX89JYGut9IcjVuw9Q8fh2iMe/grbYcvsZilxO3bPfwKfmHMb34YcLd+32K3e573ue9xe95LnvcSXEnaSTmSrEiU0IVhzlVaqcIYNuFyk6+EAQBAEAQBAEAQBAEAQBAEAQBAEAQBAdZJI42OkkcGRsBc57iAABtJJWURVWiGFVESqla6v60W6i56TT7W19UMWurHY+nYfw4ZyHhlvVjsOX3vxS4W7tvsVrMOYmR4YsTt+z3Kfu15ul4rHVlzqX1VQ7Y55yaO5jR4WjcFbILdkTeFicKFOuLqSZ3E9aqeNexrhAEBtwuUnXwgCAIAgCAIAgCAIAgCAIAgCAIAgCAiureo+ntNh0Msnq7jh4aGEguH8jtjBxz3KUscpmuNKJws3r5byKv8AN4bbQq8T9yee4pTVevtQ6leWVk3k0OOLKCHFsQw2c/a88fYrlZZZDbphSrvyXX7FJv8ANprlaOWjdyEcUgRYQBAEAQG3C5SdfCAIAgCAIAgCAIAgCAIAgCAIAgMdfNQ2ex0Zq7pVMp4s+QOOL3kfKxo8TjwWxbWskzuFiVU17m6jgbxPWiFOav6x3e6c9JZQ620JxBnxHqXjiMo/0571brDII48UmN277U9Sm5hzFJJhiwN37fbppK7JLnFziS5xxc45kk9pJVgK2qqulQhgyVg07dr9XtorbCZZTm95yZG37z3dg/sFrXV3HAzietE8TZtLOS4fwMSq+HWe/W+lGaYudPbvUepmdTMmqJAOVoe97xytG3ABo2rwy69/uWK+lE4qJ3Gxmdglq9GV4l4ar3keUgRwQBAbcLlJ18IAgCAIAgCAIAgCAIAgCAIDpNNDBE6aZ7YomDmfI8hrWgdpJyCy1qqtE0qYc5GpVVohWOr+tVHTc9Jpxgq59jq+QHyW/kbkXnfs4qy2HLznYpsKfjt7dxWMw5jazDDiXfs9+msqK53W5XSsdWXGpfVVL9skhxwHc0bGjcFa4YWRN4WJwoU6e4fK7ietVPKvU8QgMrpnTlw1DdordRN8T/FLKR4Y4x8T3cPeclq3l2yCNXu/U27KzfcSIxn6JvNjdM6ZtenbYyhoGYDIzTHDnlf2uefsHYue3l4+4fxP7E3HSbKyjt2cDE613lKdZHudrioB2MhhDeHJj9pVyyBP8ZOtSkcxL/lL1IQhTRBBAEBtwuUnXwgCAIAgCAIAgCAIAgCAICI6v6m6f07z0/N665jZRwkeE/uvzDPt3KWsMnluNP0s3r5byIv85ht9H1P3J57ilNU641BqWU+vn5KQHGOhixbC3uxHzne5XKyy6K3TAmLeuv2KTfZpNcriXDuTUYBbxGhAEB3hhlmlZDEwySyODI2NGJc5xwAA3lYc5ESq6kMtarlomtTY7p/o2DTNlbE8B1xqAJK6YZ+LsYD91mOHvXPM0v1uZK/Ymr17TpWU5clrFT71+r07CTqNJQobrRJbJtTxT0VVHPKYBFVxxu5iySNxw5iMsS1wGG5Xjl9HpAqORUStU7Sg8yLG6dFaqKtKL8FQgCnivBAEBtwuUnXwgCAIAgCAIAgCAIAgMXf9TWSwUnqbpVNgacfLj+KR5HYxg8Tls2tnLO7hYlfA1bq8igbxPWniU1q/q9e7xz0tqDrZb3Yguaf9xIPxPHwDc32q4WGRRxYpMb+5PXtKZmHMMktWx4G9/TqIB3ntOZO9TpXlWoQwdoopJZGxxMMkjyGsY0EuJOwADasKqIlVMtaqrRNZZ2jujFZVclZqIupac4ObQsP1nD8bvkG7bwVbv+YGtww4l37Ozf4dZaMu5cc+jpsKfjt7d3j1EI1hp6XT+oKu2vxMbHc9M8/NC/Nh9mR3qZsLpJ4kft29ZB5haLbzOYurZ1bCbdFtJCqrpNQ1TMYKQmOjB2OmI8T/ANDTlvO5Q3MN9wt/kt1u19XuTnLdhxvWZ2purr9i6HOa1pc4gNAxJOQACpyIXZVKW6jdVZq2SW0WGUx0LcWVFaw4Om7C2M9jN/zcNtxynJUYiSSpV2xN3X8fApOcZ6r1WOFaN2u39Xw8SsVZSrBAEAQG3C5SdfCAIAgCAIAgCAID51FTT00D6iolbDBGOaSWRwa1o7yTkF9MYrloiVVT5e9GpVVoiFWav61wx89Jppgmk2G4yj6Y/jYc38XZcVZ7Dl5VxTaP2pr7VKtmHMjW1bDpX8vRCprhca+41b6yvqH1VVJ8U0p5nYdw7huCtMUTY28LEo0qE075XcT1qp516HkEAQE36b61sOnaki4W1rnyHD/tGYumjaezldiOXv5MDxULm2Xy3DcDv+uxenxJ3Jsyht3Y2a/u2p0+HeXzQXCiuFJHWUUzKimlGMcrDiD/AI94VHlidG5WuSioX6KZsjUcxatUhHVrRk99oKWtt8XmXGlkbFyja+KVwb/kcceGKmcjzBIHK164FSvanr6EHn+WrOxrmJjatOxfT1JhYLNTWWz0lsph9OmjDObZzO2ved7nElRN1cLNIr11qpMWlu2GJsbdTUKs6tdQzK+XTtpl+i0ltxqGH4nDbC0jsHz9+zvxs+R5VSk0iaftTz9Cq5/m9VWGNdH3L5evyKpVoKkEAQHBIGZQEu0l0z1FqHkn5PQ212frJwQXN/ajyLuOQ3qKvs4ht9H1P3J5qTNhkk1xp+lm9fLebFrnx0YIAgCAIAgCAICF6v6p2Cwc9NA4XC5txHponeFh/dkzDeAxKmLDJZZ8S4Gb18kIbMM7ht9CYn7k81KW1PrK/wCpJ/MuVR9Bpxio48Wws4Nx8R3uxKuNnl8VulGJp37Sk3uZzXK1eujdsMIt0jwgCAIAgCAkWjdbXXTFd5tM4y0UhHqqNx8Dx3j7r+5yj7/Lo7ltF0O2L02Ejl2ZyWr6t0tXWnTabDWG/W2+2yK42+TzIJMiDk5jhtY8djgqDc2z4Hqx6aTotrdMnYj2LoUivVTXBsFsFBRPwu1c0hjgc4othk4nY329ik8ly3+e/jd9De9d3qRWe5n/AG7OBi/+ju5N/oUCSScTmTtKvZz4IAgMvpzSd+1FUeVa6YyMacJal3hhj/M89u4Ylal3fRW6VetPhtXsN6zy+a4WjE7dhcukekVhs3JVXHC53FuBDpG/QjP4Iztw73e5VC+z2WbCzAzvXt9C52GQxQ6X4393yJ4oMnggCAIAgCAIDEaj1ZYtO0vn3SpEZd/pQN8Usn5GDM8di27SxluHUYlfjsTtNS7vordtXrT4bSl9X9Wr9e+emoC62W12ILI3fXkGzxyDYD91vtKuFhkcUOJ+N/cnUnqUvMM/lmq1mBnf8yCgAbFNlfOUAQBAEAQBAEAQEj0PrSt0vdBOzGWhmwbWUoPxN7HNxy529nsUdmWXtuWUXQ5NS9NhJZZmTrWSqaWrrTptMZf73WXu71NzqzjLUP5g3aGNGTWN3NGS2rW3bDGjG6kNW7uXTyLI7WvShj17muei326vuVWyjoKd9VVP+GKIcxw7z3DeV5yysjbxPXhaesMD5XcLEqpbGkeicTOSr1LIJXZEW6Fx5B/LIM3cG5byqtfcxKuGFKfuXyQt2X8to3FMtf2p5r6fMtOko6Sjp2U1JCyCnjGEcUbQ1rRuAVZfI568TlqqlpjjaxOFqURD6r4PsIAgCAIAgPjWVtJRUz6qrmZT08QxklkcGtA3kr7jjc9eFqVVT4kkaxOJy0RCqdX9bM30emWY7Wm5TNy4xRnbxd7FaLDl77pv4U819PmVTMOZESrYf4l8k9fkVTWVlXW1L6qsmfUVMhxkmlcXOP8AeVaI42sbwtSiIVKWV0juJy1U+K+zzCAIAgCAIAgCAIAgCANa5zg1oLnOIDWgYkk7AANqKZRFVaIWJpLo3ebnyVV6c620RwPkZepeOBxEf6s9yr99n8ceGPG7f9vuWSw5dkko6XA3dt9umguKxabstipPTWulZTsOHO4ZveR2vefE48VUrm7kndxPWpcba0jgbwsShklrGyEAQBAEAQBAEBVvXz/xbZ/yT/SrNyz/AFH/APErHM/9NnWvgUyrgUcIAgCAIAgCAIAgCAIAgCAl/Sf/AO5ofyyf0qJzv/Wd2EzkH+002JXPzowQBAEAQBAf/9k=');border:1rpx solid #0096fa;background-position:bottom right;background-repeat:no-repeat;background-size:40% 70%;color:#0096fa;";
    }
  },

  /**
   * 选择日期
   */
  chooseDate:function(e){
    console.log(e)
    let lastIndex = this.data.dateIndex;
    let index = e.currentTarget.dataset.index;
    console.log('ok')
    let dates = this.data.dates;
    let gone =  e.currentTarget.dataset.status;

    if(gone == 0){
      wx.showToast({
        icon:'none',
        title: '该日期已过期',
      })
      return;
    }else if(gone == 1){
      wx.showToast({
        icon:'none',
        title: '不能选择今天',
      })
      return;
    }else if(index == lastIndex){
      return
    }else{
      console.log(lastIndex);

      dates[lastIndex].selected = false;
      dates[lastIndex].style = "background: white;border:1rpx solid rgb(223, 223, 223);color:black";
      dates[index].selected = true;
      this.getCssBydate(dates[index]);

      this.setData({
        dates: dates,
        dateIndex: index
      })
    }
  },

  /**
   * 改变套餐
   */
  changeTaocan:function(e){
    let index=  e.currentTarget.dataset.index;
    let lastindex= this.data.lastTaocanIndex;
    let taocans = this.data.taocans;
    taocans[lastindex].selected = false;
    taocans[index].selected = true;
    this.setData({
      taocans:taocans,
      lastTaocanIndex:index
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

  },

  /**
   * 电话输入框
   */
  phoneinput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  /**
   * 姓名输入框
   */
  nameinput: function(e) {
    this.setData({
      tname: e.detail.value
    })
  },

  /**
   * 备注输入框
   */
  beizhuinput: function(e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  /**
   * 点击了下一步
   */
  next: function() {
    let self = this;
    let options = self.data.options;//上个页面传过来的参数

    //用户信息
    let user = wx.getStorageSync('user');
    let loginrandom = user.Login_random;
    let zcode = user.zcode;

    let mobile = self.data.mobile;//填写的手机号码

    if(!mobile){//先验证是否为空
      wx.showToast({
        icon: "none",
        title: '空手机号可不行！',
        duration: 3000
      })
      return 
    }

    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {//验证手机号
      wx.showToast({
        icon:"none",
        title: '手机号不正确',
        duration:3000
      })
      return 
    } 

    let tname = self.data.tname;
    console.log(tname.length)

    if(tname == undefined || tname == ""){//名字不能为空
      wx.showToast({
        icon: "none",
        title: '您的大名不能为空',
        duration: 3000
      })
      return
    }else if(tname.length>8){//姓名长度不能大于8
      wx.showToast({
        icon: "none",
        title: '名字最多8个字符',
        duration: 3000
      })
    }

    let beizhu = self.data.beizhu;//备注信息

    //得选择的套餐
    let taocans = self.data.taocans;
    let lastTaocanIndex = self.data.lastTaocanIndex;
    let taocan = lastTaocanIndex+1;

    //得到选择的日期
    let mydates = self.data.mydates;
    let dateIndex = self.data.dateIndex;
    let hddate = mydates[dateIndex];


    app.post(API_URL, "action=BmHuoDdong&loginrandom=" + loginrandom + "&zcode=" + zcode + "&h_id=" + options.h_id + "&hddate=" + hddate + "&hdtime=" + options.hdtime + "&mobile=" + mobile + "&tname=" + tname + "&beizhu=" + beizhu + "&taocan=" + taocan, false, false, "", "", "", self).then(res => {
      console.log(res)
      wx.showModal({
        title: '提示',
        content: '恭喜您成功报名本次活动,可以在个人中心我的活动中查看订单',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({})
            wx.navigateTo({
              url: '/pages/mine/huodong/huodong',
            })
          }
        }
      })
    })
  }

})