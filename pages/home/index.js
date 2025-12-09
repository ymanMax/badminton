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
    // 消息相关
    messageBtnLeft: 680, // 初始位置（右侧）
    messageBtnBottom: 200,
    startX: 0,
    startY: 0,
    isDragging: false,
    unreadCount: 3, // 模拟未读消息数量
  },
  onLoad() {
    this.getDict();
    this.updateUnreadCount();
  },

  onShow() {
    this.updateUnreadCount();
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
  },

  // 消息入口触摸开始
  onMessageBtnTouchStart: function (e) {
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      isDragging: false
    });
  },

  // 消息入口触摸移动
  onMessageBtnTouchMove: function (e) {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - this.data.startX;
    const deltaY = currentY - this.data.startY;

    // 如果移动距离超过10rpx，则认为是拖拽
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      this.setData({
        isDragging: true
      });

      // 获取屏幕宽度和高度
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      const btnWidth = 100; // 按钮宽度（rpx）
      const btnHeight = 100; // 按钮高度（rpx）

      // 计算新位置（转换为rpx）
      let newLeft = (currentX / windowWidth) * 750 - btnWidth / 2;
      let newBottom = ((windowHeight - currentY) / windowHeight) * 750 - btnHeight / 2;

      // 边界检查
      newLeft = Math.max(0, Math.min(newLeft, 750 - btnWidth));
      newBottom = Math.max(0, Math.min(newBottom, 750 * (windowHeight / windowWidth) - btnHeight));

      this.setData({
        messageBtnLeft: newLeft,
        messageBtnBottom: newBottom
      });
    }
  },

  // 消息入口触摸结束
  onMessageBtnTouchEnd: function (e) {
    if (this.data.isDragging) {
      // 获取屏幕宽度
      const { windowWidth } = wx.getSystemInfoSync();
      const screenCenterX = 750 / 2; // 屏幕中心（rpx）
      const btnWidth = 100; // 按钮宽度（rpx）

      // 判断距离左右屏幕的距离
      const currentLeft = this.data.messageBtnLeft;
      const distanceToLeft = currentLeft;
      const distanceToRight = 750 - (currentLeft + btnWidth);

      // 自动贴边到距离较近的一侧
      let newLeft;
      if (distanceToLeft < distanceToRight) {
        newLeft = 0; // 贴左边
      } else {
        newLeft = 750 - btnWidth; // 贴右边
      }

      this.setData({
        messageBtnLeft: newLeft
      });
    }
  },

  // 跳转到消息列表页面
  goToMessageList: function (e) {
    // 如果是拖拽状态，则不跳转
    if (this.data.isDragging) {
      return;
    }

    wx.navigateTo({
      url: '/pages/msgInfo/index'
    });
  },

  /**
   * 更新未读消息数量
   */
  updateUnreadCount: function () {
    const messages = wx.getStorageSync('messageList') || [];
    const unreadCount = messages.filter(msg => !msg.isRead).length;

    this.setData({
      unreadCount: unreadCount
    });
  }
})