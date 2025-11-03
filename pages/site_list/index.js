const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    listData: [],
  },

  onLoad() {
    this.getListData();
  },
  getListData() {
    app.request('post', 'applet/badminton/place/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {}
    }, (res) => {
      if (res.code == '0000') {
        const { records, current, pages } = res.data;
        this.setData({
          allPage: pages,
          currentPage: current,
          listData: this.data.currentPage != 1 ? [...this.data.listData, ...records] : records,
        });
        return;
      }
      app.toast(res.msg);
    });
  },
  toDetail(e) {
    const { arg } = e.currentTarget.dataset;
    app.globalData.tempData = arg;
    wx.navigateTo({
      url: '/pages/info_detail/index',
    });
  },
});