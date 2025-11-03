const app = getApp()

Page({
  data: {
    imgHost: app.globalData.imgHost,
    kindList: [],
    orderList: [],
  },
  onLoad: function (options) {
    this.getDict();
  },
  onShow: function () {
    
  },
  getDict() {
    app.request('post', 'common/getDictTypeList', {}, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.find(item => item.dictCode == 'pay_status').dictDataModelList || [];
        tempArr.forEach((item) => {
          item.text = item.dictLabel;
          item.value = item.dictValue;
        });
        this.setData({
          kindList: tempArr,
        });
        this.getOrderList();
        return;
      }
      app.toast(res.msg);
    });
  },
  // 取消订单
  cancelOrder(e) {
    const { arg } = e.currentTarget.dataset;
    app.confirm({ content: '确认取消参加活动？' }, (res) => {
      if (res.cancel) return;
      app.request('post', 'applet/badminton/activity/cancelActivityApply', {
        id: arg.id
      }, (res) => {
        if (res.code == '0000') {
          app.toast("取消成功");
          setTimeout(() => {
            this.getOrderList();
          }, 1000);
          return;
        }
        app.toast(res.data);
      });
    });
  },
  toDetail(e) {
    const { arg } = e.currentTarget.dataset;
    if (arg.payStatus != 0) return;
    app.globalData.orderInfo = arg;
    wx.navigateTo({
      url: '/pages/pay/index?type=1',
    });
  },
  getOrderList() {
    app.request('post', 'applet/badminton/activityApply/getPageList', {
      query: {},
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.records || [];
        tempArr.forEach((item) => {
          item.activityModel.endTime && (item.endTm = app.parseDateTime(item.activityModel.endTime).split(' ')[0]);
          item.activityModel.startTime && (item.startTm = app.parseDateTime(item.activityModel.startTime).split(' ')[0]);
        });
        this.setData({
          orderList: tempArr,
        });
        return;
      }
      app.toast(res.data);
    });
  },
})