// pages/chat/chat.js
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    newslist: [],
    userInfo: {},
    scrollTop: 0,
    increase: false, //图片添加区域隐藏
    aniStyle: true, //动画效果
    message: "",
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
   
    
  },
  // 页面卸载
  onUnload() {
    wx.closeSocket();
    wx.showToast({
      title: 服务器连接断开,
      icon: "none",
      duration: 2000
    })
  },
  //事件处理函数
  send: function () {
    var flag = this;
    var m = flag.data.message.trim();
   
   
    
    let dialog = flag.data.newslist;
    dialog.push({
      id: dialog.length,
      nickName: flag.data.userInfo.nickName,
      content: m,
      type: 'text'
    });
    flag.setData({
      newslist: dialog
    }, () => {
      // flag.bottom();
    });
    this.setData({
      massage: ''
    })
    console.log(m)
    //发送聊天内容到服务器
    wx.request({
      url: 'http://localhost:7001/chat',//仅为示例，并非真实的接口地址
      data: {
        msg: m
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.Reply);
        let dialog = flag.data.newslist;
        
        
        dialog.push({
          id: dialog.length + 1,
          nickName: '小白',
          content: res.data.Reply,
          type: 'text'
        });
        flag.setData({
          newslist: dialog
        }, function () {
          flag.bottom();
        });

      }
    })
  },
  //监听input值的改变
  bindChange(res) {
    this.setData({
      message: res.detail.value
    })
  },
  cleanInput() {
    //button会自动清空，所以不能再次清空而是应该给他设置目前的input值
    this.setData({
      message: this.data.message
    })
  },
  
  bottom: function () {
    wx.pageScrollTo({
      scrollTop: 1000000000
    })
  },
})