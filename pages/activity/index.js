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
    currentShareActivity: null, // 当前选中的分享活动
  },
  onShow() {
    this.getDict();
  },
  getDict() {
    // 使用mock数据替代后端接口
    const tempArr = [
      { dictValue: '1', dictLabel: '羽毛球活动' },
      { dictValue: '2', dictLabel: '乒乓球活动' },
      { dictValue: '3', dictLabel: '网球活动' }
    ];
    this.setData({
      venueOptions: tempArr,
      activeIndex: tempArr[0].dictValue,
    });
    this.getListData();
  },
  getListData() {
    // 使用mock数据替代后端接口
    const mockData = [
      {
        id: 1,
        name: '周末羽毛球友谊赛',
        description: '欢迎各位羽毛球爱好者参加周末友谊赛，以球会友，共同进步！',
        image: '/images/activity1.jpg',
        peopleNum: 20,
        applyNum: 12,
        startTime: '2025-12-15 14:00:00',
        endTime: '2025-12-15 17:00:00',
        location: '朝阳区羽毛球馆',
        price: '免费',
        maxNum: false
      },
      {
        id: 2,
        name: '羽毛球基础训练班',
        description: '针对初学者的羽毛球基础训练班，教授正确的握拍姿势和基本技巧。',
        image: '/images/activity2.jpg',
        peopleNum: 15,
        applyNum: 8,
        startTime: '2025-12-20 19:00:00',
        endTime: '2025-12-20 21:00:00',
        location: '海淀区体育中心',
        price: '50元/人',
        maxNum: false
      },
      {
        id: 3,
        name: '高级羽毛球技巧提升班',
        description: '针对有一定基础的球友，提升羽毛球高级技巧和战术意识。',
        image: '/images/activity3.jpg',
        peopleNum: 12,
        applyNum: 12,
        startTime: '2025-12-22 15:00:00',
        endTime: '2025-12-22 17:30:00',
        location: '东城区羽毛球训练馆',
        price: '80元/人',
        maxNum: true
      }
    ];

    // 处理时间格式
    mockData.forEach((item) => {
      item.endTm = item.endTime.split(' ')[0];
      item.startTm = item.startTime.split(' ')[0];
    });

    this.setData({
      allPage: 1,
      currentPage: 1,
      listData: mockData,
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

  // 分享按钮点击事件
  onShareClick(e) {
    const activity = e.currentTarget.dataset.arg;
    this.setData({
      currentShareActivity: activity
    });

    // 提示用户点击右上角分享
    wx.showModal({
      title: '分享活动',
      content: `您将分享活动：${activity.name}\n\n请点击右上角的分享图标，选择分享给好友或朋友圈。`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 用户点击右上角分享给好友
   */
  onShareAppMessage() {
    const activity = this.data.currentShareActivity || this.data.listData[0];

    if (!activity) {
      return {
        title: '精彩活动等你来',
        path: '/pages/activity/index',
        imageUrl: '/images/share_default.jpg'
      };
    }

    // 构造分享内容
    const shareTitle = activity.name;
    const shareDesc = `${activity.description}\n\n活动时间：${activity.startTime}\n活动地点：${activity.location}\n活动价格：${activity.price}`;
    const sharePath = `/pages/activity/index?id=${activity.id}`;

    // 模拟自定义分享图片（实际项目中应该从服务器获取）
    const shareImageUrl = activity.image || '/images/share_default.jpg';

    return {
      title: shareTitle,
      desc: shareDesc,
      path: sharePath,
      imageUrl: shareImageUrl,
      success: () => {
        app.toast('分享成功');
      },
      fail: () => {
        app.toast('分享失败，请重试');
      }
    };
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline() {
    const activity = this.data.currentShareActivity || this.data.listData[0];

    if (!activity) {
      return {
        title: '精彩活动等你来',
        imageUrl: '/images/share_default.jpg'
      };
    }

    // 构造朋友圈分享内容
    const shareTitle = `${activity.name} - ${activity.location} - ${activity.price}`;

    // 模拟自定义分享图片（实际项目中应该从服务器获取）
    const shareImageUrl = activity.image || '/images/share_default.jpg';

    return {
      title: shareTitle,
      imageUrl: shareImageUrl,
      query: `id=${activity.id}`,
      success: () => {
        app.toast('分享到朋友圈成功');
      },
      fail: () => {
        app.toast('分享失败，请重试');
      }
    };
  },
});
