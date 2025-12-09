const app = getApp();
const siteData = require('../../site.json'); // 导入mock场馆数据

Page({
  data: {
    favoriteSites: [], // 收藏的场馆列表
  },

  onLoad() {
    this.loadFavoriteSites(); // 加载收藏的场馆数据
  },

  onShow() {
    // 页面显示时重新加载数据，确保数据是最新的
    this.loadFavoriteSites();
  },

  // 加载收藏的场馆数据
  loadFavoriteSites() {
    try {
      // 从本地存储中获取收藏的场馆ID
      const favorites = wx.getStorageSync('favorites') || [];

      // 根据收藏的ID筛选场馆数据
      const favoriteSites = siteData.filter(site => favorites.indexOf(site.id) > -1);

      this.setData({
        favoriteSites: favoriteSites
      });
    } catch (e) {
      console.error('加载收藏场馆数据失败:', e);
    }
  },

  // 取消收藏场馆
  removeFavorite(e) {
    const siteId = parseInt(e.currentTarget.dataset.id);

    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这个场馆吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 从本地存储中获取收藏的场馆ID
            let favorites = wx.getStorageSync('favorites') || [];

            // 移除要取消收藏的场馆ID
            const index = favorites.indexOf(siteId);
            if (index > -1) {
              favorites.splice(index, 1);

              // 保存更新后的收藏数据
              wx.setStorageSync('favorites', favorites);

              // 重新加载收藏的场馆数据
              this.loadFavoriteSites();

              wx.showToast({
                title: '已取消收藏',
                icon: 'success'
              });
            }
          } catch (e) {
            console.error('取消收藏失败:', e);
            wx.showToast({
              title: '取消收藏失败',
              icon: 'error'
            });
          }
        }
      }
    });
  },

  // 跳转到场馆详情页面
  navigateToSite(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/site_list/index?id=' + id,
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空方法，用于阻止事件冒泡
  },

  // 跳转到首页
  goToHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
})
