const app = getApp()

Page({
  data: {
    nickName: '',
    userNo: '',
    avatarUrl: '',
    tempAvatar: '',
    menuList: [
      { icon: 'balance-list-o', descp: '我的订单', url: '/pages/orderInfo/index' },
      { icon: 'star-o', descp: '我的收藏', url: '/pages/my_collect/index' },
      { icon: 'like-o', descp: '我的点赞', url: '/pages/my_like/index' },
      { icon: 'service-o', descp: '联系我们', url: '' },
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
          nickName: res.data.nickName
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