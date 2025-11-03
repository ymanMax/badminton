const app = getApp();

Page({
  data: {
    show: false,
    title: '',
    curInfo: {},
    dataInfo: {},
    licensePlate: '',
    selectedDate: '', // 默认日期，需要在页面加载时设置为当天日期
    minDate: '', // 最小日期（当天）
    maxDate: '', // 最大日期（七天后）
    reservePlaceApplyList: []
  },
  onLoad(options) {
    this.setData({
      curInfo: app.globalData.tempData
    });
    // 设置默认日期为当天
    const today = this.formatDate(new Date());
    // 设置最小日期为当天
    this.setData({
      minDate: today,
      selectedDate: today
    });
    // 设置最大日期为七天后
    const sevenDaysLater = this.formatDate(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
    this.setData({
      maxDate: sevenDaysLater
    });
    this.getInfo();
  },
  onDateChange: function (e) {
    this.setData({
      selectedDate: e.detail.value
    });
    this.getInfo();
  },
  // 格式化日期为YYYY-MM-DD格式
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
  // 获取数据
  getInfo() {
    app.request('post', 'applet/badminton/place/getReservePlace', {
      id: this.data.curInfo.id,
      checkDate: this.data.selectedDate
    }, (res) => {
      if (res.code == '0000') {
        const { title, content, reservePlaceApplyList } = res.data;
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
          reservePlaceApplyList
        });
        return;
      }
      app.toast(res.data);
    });
  },
  openDialog() {
    this.setData({
      show: !this.data.show,
    });
  },
  onChange(e) {
    this.setData({
      licensePlate: e.detail
    });
  },
  toPre(e) {
    const { code, isReservation } = e.currentTarget.dataset.arg;
    if (isReservation) return;
    app.globalData.orderInfo = {
      ...this.data.curInfo,
      placeTime: code,
      selectedDate: this.data.selectedDate,
    };
    wx.navigateTo({
      url: '/pages/pay/index',
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
