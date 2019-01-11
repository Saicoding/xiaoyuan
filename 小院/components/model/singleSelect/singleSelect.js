// components/errorRecovery/errorRecovery.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
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
        focus: true
      })
    },
    //toogle展示
    toogleDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //阻止事件冒泡
    stopBubbling: function(e) {},

    //点击了空地,让蒙版消失
    tapBlank: function(e) {
      this.setData({
        isShow: false
      })
    },

    //改变选项
    _changeSelect: function(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        myindex:index
      })
      this.triggerEvent('changeSelect',{myindex:index});
    }

  }
})