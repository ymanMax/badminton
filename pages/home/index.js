const app = getApp();
const siteData = require('../../site.json'); // 导入mock场馆数据

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
    favorites: [], // 收藏的场馆ID列表
  },
  onLoad() {
    this.loadFavorites(); // 加载本地存储的收藏数据
    this.setMockData(); // 设置mock场馆数据
    this.setVenueOptions(); // 设置场馆类型选项
  },
  // 设置mock场馆数据
  setMockData() {
    this.setData({
      listData: siteData
    });
  },

  // 设置场馆类型选项
  setVenueOptions() {
    const venueOptions = [
      { dictValue: '0', dictLabel: '全部场馆' },
      { dictValue: '1', dictLabel: '室内场馆' },
      { dictValue: '2', dictLabel: '室外场馆' }
    ];
    this.setData({
      venueOptions: venueOptions,
      activeIndex: venueOptions[0].dictValue,
    });
  },

  // 加载本地存储的收藏数据
  loadFavorites() {
    try {
      const favorites = wx.getStorageSync('favorites') || [];
      this.setData({
        favorites: favorites
      });
    } catch (e) {
      console.error('加载收藏数据失败:', e);
    }
  },

  // 保存收藏数据到本地存储
  saveFavorites() {
    try {
      wx.setStorageSync('favorites', this.data.favorites);
    } catch (e) {
      console.error('保存收藏数据失败:', e);
    }
  },

  // 收藏/取消收藏场馆
  toggleFavorite(e) {
    const siteId = parseInt(e.currentTarget.dataset.id);
    const favorites = [...this.data.favorites];
    const index = favorites.indexOf(siteId);

    if (index > -1) {
      // 取消收藏
      favorites.splice(index, 1);
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      });
    } else {
      // 添加收藏
      favorites.push(siteId);
      wx.showToast({
        title: '已添加收藏',
        icon: 'success'
      });
    }

    this.setData({
      favorites: favorites
    });

    // 保存到本地存储
    this.saveFavorites();
  },

  // 检查场馆是否已收藏
  isFavorite(siteId) {
    return this.data.favorites.indexOf(siteId) > -1;
  },

  // 根据场馆类型过滤数据
  getListData() {
    const { activeIndex } = this.data;
    let filteredData = siteData;

    if (activeIndex !== '0') {
      // 这里可以根据实际需求添加过滤逻辑
      // 目前mock数据中没有placeType字段，所以暂时不做过滤
      // filteredData = siteData.filter(item => item.placeType === activeIndex);
    }

    this.setData({
      listData: filteredData
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
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空方法，用于阻止事件冒泡
  }
})