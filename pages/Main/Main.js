// pages/Main/Main.js

var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  Dates:'',
  
  },
  
  Chatpage:function(){
    wx.navigateTo({
      url: '../Chat/Chat',
    })
  },
  Transpage:function(){
    wx.navigateTo({
      url: '../Trans/Trans',
    })
  },

  Drscern:function(){
    wx.navigateTo({
      url: '../Drscern/Drscern',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

    // 获取当前星期几
    var today=new Date();
    var currentDate=today.getDay();//获取存储当前日期
    var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    console.log("今天是：" + weekday[currentDate])
    
    //为页面中time赋值
     this.setData({
     Dates:  weekday[currentDate]   })
    
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})