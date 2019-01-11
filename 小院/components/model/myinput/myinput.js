// components/errorRecovery/errorRecovery.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    placeholder:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: false
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: true,
        focus:true
      })
    },
    //toogle展示
    toogleDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //阻止事件冒泡
    stopBubbling: function (e) { },

    //点击了空地,让蒙版消失
    tapBlank: function (e) {
      this.setData({
        isShow: false
      })
    },

    //输入文字
    _inputText:function(e){
      let value = e.detail.value;
      let title = this.data.title
      this.triggerEvent('inputText',{text:value,title:title});//输入文字时返回修改的标题和输入框的内容
    },

    //确定按钮被执行
    _confirm:function(e){
      let title = this.data.title;
      this.triggerEvent('confirm',{title:title});
      this.hideDialog();
    },

    //取消按钮被执行
    _cancel:function(e){
      this.hideDialog();
    }
  }
})