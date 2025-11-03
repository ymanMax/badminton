const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    show: false,
    curInfo: {},
    listData: [],
    venueOptions: [],
    selectedVenue: '0',
    activeIndex: '',
  },
  onShow() {
    this.getDict();
  },
  getDict() {
    app.request('post', 'common/getDictTypeList', {}, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.find(item => item.dictCode == 'activity_type').dictDataModelList || [];
        this.setData({
          venueOptions: tempArr,
          activeIndex: tempArr[0].dictValue,
        });
        this.getListData();
        return;
      }
      app.toast(res.msg);
    });
  },
  getListData() {
    app.request('post', 'applet/badminton/activity/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {
        activityType: this.data.activeIndex,
      }
    }, (res) => {
      if (res.code == '0000') {
        const { records, current, pages } = res.data;
        records.forEach((item) => {
          item.endTime && (item.endTm = app.parseDateTime(item.endTime).split(' ')[0]);
          item.startTime && (item.startTm = app.parseDateTime(item.startTime).split(' ')[0]);
        });
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
  onCreate() {
    wx.navigateTo({
      url: '/pages/create_activity/index',
    });
  },
  // 格式化日期为YYYY-MM-DD格式
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  navigateToSite(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/site_list/index?id=" + id,
    });
  },
  onVenueChange: function (e) {
    const index = e.detail.value;
    this.setData({
      activeIndex: this.data.venueOptions[index].dictValue,
      selectedVenue: index
    });
    this.getListData();
  },
  toPre(e) {
    const { arg } = e.currentTarget.dataset;
    this.setData({
      curInfo: arg,
      show: true,
    });
  },
  onConfirm() {
    this.setData({
      show: false,
    });
    app.request('post', 'applet/badminton/createActivityApply', {
      activityId: this.data.curInfo.id
    }, (res) => {
      if (res.code == '0000') {
        app.toast('报名成功');
        this.getListData();
        return;
      }
      app.toast(res.msg);
    });
  },
});
