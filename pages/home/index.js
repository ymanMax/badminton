const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    tips: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
    swiperList: [{
        id: 1,
        img: 'https://www.yulinjue.com/venueimages/6936.jpg'
      },/*  */
      {
        id: 2,
        img: 'https://ts1.cn.mm.bing.net/th/id/R-C.d13486583d9d81160125c6d6e5ce57f4?rik=emRwpSTThJILRA&riu=http%3a%2f%2fwww.eryush.com%2fpic%2f20201118073636643.jpg&ehk=mFpf2OE6qRALJzvQ41y%2bzz4pNO386JA9WDg7N4cwT7E%3d&risl=&pid=ImgRaw&r=0'
      },
      {
        id: 3,
        img: 'https://ts1.cn.mm.bing.net/th/id/R-C.1b888eaf083940a0da6cf02ea2258ef6?rik=NtUmxxpjkwD34Q&riu=http%3a%2f%2fsports.njau.edu.cn%2f__local%2f1%2fB8%2f88%2fEAF083940A0DA6CF02EA2258EF6_9A619068_10F392.jpg%3fe%3d.jpg&ehk=oW7ycGvhOFRWmWioRLosnxDeNASFQS6fvkaIuTYlv5Y%3d&risl=&pid=ImgRaw&r=0'
      }
    ],
    hotData: [],
    listData: [],
    venueOptions: [],
    selectedVenue: '0',
    activeIndex: '',
  },
  onLoad() {
    this.getDict();
  },
  getDict() {
    app.request('post', 'common/getDictTypeList', {}, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.find(item => item.dictCode == 'stadium_type').dictDataModelList || [];
        this.setData({
          venueOptions: tempArr,
          activeIndex: tempArr[0].dictValue,
        });
        this.getListData();
        this.getHotData();
        return;
      }
      app.toast(res.msg);
    });
  },
  getHotData() {
    app.request('post', 'applet/badminton/activity/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {}
    }, (res) => {
      if (res.code == '0000') {
        const {
          records
        } = res.data;
        this.setData({
          hotData: records.slice(0, 2),
        });
        return;
      }
      app.toast(res.msg);
    });
  },
  getListData() {
    app.request('post', 'applet/badminton/stadium/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {
        placeType: this.data.activeIndex,
      }
    }, (res) => {
      if (res.code == '0000') {
        const {
          records,
          current,
          pages
        } = res.data;
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
  pageSkip() {
    wx.switchTab({
      url: '/pages/activity/index',
    });
  },
  navigateToSite(e) {
    const {
      id
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/site_list/index?id=' + id,
    });
  },
  onVenueChange: function (e) {
    const index = e.detail.value;
    this.setData({
      activeIndex: this.data.venueOptions[index].dictValue,
      selectedVenue: index
    });
    this.getListData();
  }
})