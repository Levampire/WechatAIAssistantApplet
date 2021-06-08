const app=getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
var recordState=false; //录音状态
var content="";
var yuyinCallback = null;
initRecord();
function initRecord() {
  manager.onRecognize = function (res) {
    console.log("成功开始识别", res)
  }
  manager.onStart = function (res) {
    console.log("成功开始录音", res)
  }
  manager.onError = function (res) {
    console.error("error msg", res)
  }
  manager.onStop = function (res) {
    let text = res.result;
    console.log('结束录音，语音内容： ' + text);
    //--mock start--
    // text = '向上'
    //--mock end---
    if (!text || text.lenth == 0) {
      wx.showModal({
        title: '提示',
        content: '听不清楚，请重新说一遍！',
        showCancel: false,
        success: function (res) { }
      })
      return;
    }
    content = text.replace("。","");
    console.log("松开按钮到获取语音文本时间："+(new Date().getTime()- endTime))
    if (yuyinCallback){
      yuyinCallback(content);
    }else{
      yuyinCallback = null;
    }
  }
}
function getRecordAuth() {
    // 获取用户是否授权录音
    wx.getSetting({
      success: (res) => {
        // 如果未授权提示用户,当前功能需要录音功能才能使用
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log("用户允许录音")
            },
            fail(res) {
              wx.showModal({
                title: '授权提示',
                content: '该应用需要使用你的录音权限，是否同意？',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户同意使用录音权限')
                    // 当用户第一次授权拒绝时，根据最新的微信获取权限规则，不会再次弹框提示授权，需要用户主动再设置授权页面打开授权，需要做对应的文案提示
                    wx.openSetting()
                  } else if (res.cancel) {
                    console.log('用户不同意使用录音权限');
                  }
                }
              })
            }
          })
        } else {
          console.log("已有录音权限")
        }
      }
    })
  }
  var startTime = 0;
  var endTime = 0;
  var startOver = true;
  var endEnable = true;
  function onMikeStart(e) {
    if (!startOver){
    endEnable = false;
      return;
    }else{
      startOver = false;
      endEnable = true;
    }
    startTime = new Date().getTime();
    console.log("点击开始：" + startTime)
    recordState=true;
    setTimeout(function(){
      if (!recordState){
        console.log("时间小于0.5秒，认为误点，不进行录音");
        startOver = true;
        return;
      }
      console.log("开始录音，调用manager.start（）")
      manager.start({
        duration:30000,
        lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
      });
      console.log("开始录音，调用manager.start完成")
      startOver = true;
    },500)
  }
  function onMikeEnd(callback) {
    if(!endEnable){
      return;
    }
    recordState=false
    endTime = new Date().getTime();
    console.log("点击结束：" + endTime)
    let time = endTime - startTime;
    console.log("按钮时间："+time);
    if(time < 500){
      console.log("时间太短，不调用调用manager.stop()")
      return;
    }
  // 语音结束识别
  console.log("调用manager.stop()结束录音")
  manager.stop();
  console.log("调用manager.stop()结束录音完成")
  
  yuyinCallback = callback;
}
module.exports = {
  onMikeStart: onMikeStart,
  onMikeEnd: onMikeEnd,
  getRecordAuth: getRecordAuth
}  
// pages/translation/translation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabname:['文本','语音'],
    active:0,
    content1:'',
    content2:'',
    //语音录入
    recordState: false, //录音状态
    content:'',//内容
  },
  Insert:function(){
    let _this=this
    wx.getClipboardData({
      success (res){
        console.log(res.data)
      _this.setData({
      content1:res.data
    })
      }
    })
  },
  // 点击tap切换
  change:function(a){
    console.log(a.currentTarget.dataset.index)
    this.setData({
      active:a.currentTarget.dataset.index
    })
  },

  test:function(e){
    // console.log(e.detail.value.a);
    // this.setData({
    //   content2:''
    // });
    console.log(e)
    console.log(msg)
    let msg=e.detail.value.a;
    console.log(e)
    console.log(msg)
    let _this=this;
    console.log(e)
    console.log(msg)
    wx.request({
      url: 'http://localhost:7001/translation',//仅为示例,并非真实的接口地址
      data:{//向服务器发请求携带的参数
        msg:msg
      },
      header:{
        'content-type':'application/json'//数据类型为json格式
      },
      method:'GET',//请求的方法,方法值要大写
      success:function(res){//请求成功的回调函数
        console.log(res);
        _this.setData({
          content2:res.data.TargetText
        });
      },
      fail:function(err){//请求失败的回调函数
        console.log(err)
      }
    })
  },
//B页面语音录入
   // 手动输入内容
   conInput: function (e) {
    this.setData({
      content:e.detail.value,
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音')
      console.log('录音临时文件地址 -->' + res.tempFilePath); 
      console.log('录音总时长 -->' + res.duration + 'ms'); 
      console.log('文件大小 --> ' + res.fileSize + 'B');
      console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      }
      var text = that.data.content + res.result;
      that.setData({
        content: text
      })
    }
  },
  //语音  --按住说话
  touchStart:function (e) {
    this.setData({
      recordState: true  //录音状态
    })
    // 语音开始识别
    manager.start({
      lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    this.setData({
     recordState: false
    })
    // 语音结束识别
    manager.stop();
  },
  get: function(e){
    this.setData({
      content1: e.detail.value
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
    //识别语音
    this.initRecord();
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