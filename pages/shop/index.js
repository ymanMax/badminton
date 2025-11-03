
const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    shopList: [],
    tabList: [],
    active: '',
    searchValue: '',
  },

  onLoad() {
    this.getDict();
    this.selectComponent('#tabs').resize();
  },
  onChange1(e) {
    this.setData({
      searchValue: e.detail,
    });
  },
  getDict() {
    app.request('post', 'common/getDictTypeList', {}, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.find(item => item.dictCode == 'product_type').dictDataModelList || [];
        this.setData({
          tabList: tempArr,
          active: tempArr[0].dictValue,
        });
        this.getListData();
        return;
      }
      app.toast(res.msg);
    });
  },
  onChange(e) {
    this.setData({
      active: e.detail.name
    });
    this.getListData();
  },
  navigateToDetail(e) {
    const { arg } = e.currentTarget.dataset;
    app.globalData.shopInfo = arg;
    wx.navigateTo({
      url: "/pages/shop_detail/index",
    });
  },
  getListData() {
    app.request('post', 'applet/badminton/product/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {
        productType: this.data.active,
        name: this.data.searchValue
      }
    }, (res) => {
      if (res.code == '0000') {
        const { records, current, pages } = res.data;
        this.setData({
          allPage: pages,
          currentPage: current,
          shopList: this.data.currentPage != 1 ? [...this.data.shopList, ...records] : records,
        });
        return;
      }
      app.toast(res.msg);
    });
  },
});