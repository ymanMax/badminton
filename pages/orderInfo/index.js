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
    app.confirm({ content: '确认取消该笔订单？' }, (res) => {
      if (res.cancel) return;
      app.request('post', 'applet/order/cancelOrder', {
        id: arg.id
      }, (res) => {
        if (res.code == '0000') {
          this.getOrderList();
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
    app.request('post', 'applet/badminton/productOrder/getPageList', {
      query: {},
      page: {
        size: 999,
        current: 1,
      },
    }, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.records || [];
        tempArr.forEach((item) => {
          item.orderTime && (item.orderTm = app.parseDateTime(item.orderTime));
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