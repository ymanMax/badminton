const app = getApp();

Page({
  data: {
    show: false,
    title: '',
    curInfo: {},
    dataInfo: {},
    imgHost: app.globalData.imgHost,
  },
  onLoad(options) {
    this.setData({
      curInfo: app.globalData.shopInfo
    });
    this.getInfo(app.globalData.shopInfo.id);
  },
  // 获取数据
  getInfo(id) {
    app.request('get', `applet/badminton/product/${id}`, {}, (res) => {
      if (res.code == '0000') {
        const { title, content } = res.data;
        let result = app.towxml(content,'markdown',{
          base: app.globalData.imgHost, // 相对资源的base路径
          theme:'light', // 主题，默认`light`
          events:{  // 为元素绑定的事件方法
            tap:(e)=>{
              console.log('tap',e);
            }
          }
        });
        this.setData({
          title,
          dataInfo: result,
        });
        app.globalData.orderInfo = res.data
        return;
      }
      app.toast(res.data);
    });
  },
  toPre() {
    this.setData({
      show: true,
    });
  },
  onConfirm() {
    this.setData({
      show: false,
    });
    wx.navigateTo({
      url: '/pages/pay_product/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onShareTimeline() {
    
  }
});
