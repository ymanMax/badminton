const app = getApp();

Page({
  data: {
    orderInfo: {},
    isComplete: false,
  },
  onLoad(options) {
    this.createOrder();
  },
  backHome() {
    wx.reLaunch({
      url: '/pages/home/index',
    });
  },
  createOrder() {
    const { id = '', price = '' } = app.globalData.orderInfo;
    app.request('post', 'applet/badminton/product/createProductOrder', {
      productId: id,
      price,
      orderNum: 1,
    }, (res) => {
      if (res.code != '0000') {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return;
      }
      this.setData({
        orderInfo: res.data,
      });
    });
  },
  submit() {
    app.confirm({ content: '确认支付吗？' }, (res) => {
      if (res.cancel) return;
      const { id,  } = this.data.orderInfo;
      app.request('post', 'applet/badminton/product/paySuccess', { id, productId: app.globalData.orderInfo.id }, (res) => {
        if (res.code != '0000') {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                this.setData({
                  isComplete: true,
                });
                wx.setNavigationBarTitle({
                  title: '提交成功',
                });
              }, 500);
            }
          });
        }
      });
    });
  }
})