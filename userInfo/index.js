const app = getApp()

Page({
  data: {
    nickName: '',
    userNo: '',
    avatarUrl: '',
    tempAvatar: '',
    pointsBalance: 0, // 积分余额
    menuList: [
      { icon: 'balance-list-o', descp: '我的订单', url: '/pages/orderInfo/index' },
      { icon: 'star-o', descp: '我的收藏', url: '/pages/my_collect/index' },
      { icon: 'like-o', descp: '我的点赞', url: '/pages/my_like/index' },
      { icon: 'service-o', descp: '联系我们', url: '' },
      { icon: 'gift-o', descp: '我的积分', url: '/pages/points_detail/index' }, // 新增积分明细页面跳转
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
        this.setData({
          userNo: res.data.userNo,
          avatarUrl: app.globalData.imgHost + res.data.headPortraitLink ,
          nickName: res.data.nickName,
          pointsBalance: res.data.pointsBalance || 0 // 获取积分余额，默认0
        })
        return;
      }
      app.toast(res.msg);
    });
  },

  // 获取积分余额的方法（如果需要单独获取）
  getPointsBalance() {
    app.request('post', 'applet/user/getPointsBalance', {}, (res) => {
      if (res.code == '0000') {
        this.setData({
          pointsBalance: res.data.pointsBalance || 0
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