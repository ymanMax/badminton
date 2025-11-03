const app = getApp()

Page({
  data: {
    nickName: '',
    userNo: '',
    avatarUrl: '',
    tempAvatar: '',
    menuList: [
      { icon: 'vip-card-o', descp: '个人资料', url: '/pages/edit_info/index' },
      { icon: 'orders-o', descp: '场馆预约', url: '/pages/place_order/index' },
      { icon: 'fire-o', descp: '我的活动', url: '/pages/act_order/index' },
      { icon: 'bag-o', descp: '商品订单', url: '/pages/orderInfo/index' },
      { icon: 'service-o', descp: '意见反馈', url: '' },
    ],
  },
  onLoad() {
    this.getUserInfo();
  },
  onShow() {
    if (app.globalData.backFresh) {
      this.getUserInfo();
      app.globalData.backFresh = false;
    }
  },
  editnickName() {
    wx.navigateTo({
      url: '/pages/edit_info/index',
    })
  },
  getUserInfo() {
    app.request('post', 'applet/user/getUserInfo', {}, (res) => {
      if (res.code == '0000') {
        wx.setStorageSync('userInfo', res.data);
        const { headPortraitLink, userNo, nickName } = res.data;
        this.setData({
          userNo: userNo,
          avatarUrl: headPortraitLink ? app.globalData.imgHost + headPortraitLink : '',
          nickName: nickName
        })
        return;
      }
      app.toast(res.msg);
    });
  },
  pageSkip(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.arg.url,
    });
  },
})