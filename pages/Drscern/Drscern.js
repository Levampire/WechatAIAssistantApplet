// pages/Drscern/Drscern.js

const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content1:"",
    //tempFilePaths: ''
    imageUrl:'',
    base64:''
    

  },

  Tran:function(){
    wx.navigateTo({
      url: '../Trans/Trans',
    })
  },
  //上传并识别图片
  Choose:function(){
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function success(res) {
        wx.showToast({
          title: '正在处理...',
          icon: 'loading',
          mask: true,
          duration: 500
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
         var tempFilePaths = res.tempFilePaths
        _this.setData({
          imageUrl:tempFilePaths,
         // tempFilePaths: res.tempFilePaths
        });
        console.log(tempFilePaths);
        console.log(res);
        wx.getFileSystemManager().readFile({
          filePath:res.tempFilePaths[0],
          encoding:'base64',
          complete:res=>{
               console.log('Complete')
          },
          success: res=>{
           console.log(res.data);
           _this.setData({
             base64:res.data
           });
          }
        })
      }
    });
    
  },


  Distinguish:function(res){
    var _this = this;
    wx.request({
      url: 'http://127.0.0.1:7001/char',
      method:'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        image:_this.data.base64
        
      },
      success:function(res){//请求成功的回调函数
        console.log('完成调用')
        //console.log(res.data.TextDetections[1].DetectedText);
        let text=""
        for(let i=0;i<res.data.TextDetections.length;i++){
          text+='\n'+res.data.TextDetections[i].DetectedText
          
        }
        console.log(text);
        _this.setData({
          content1:text
        });
      },
    })

  },
  
  























  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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