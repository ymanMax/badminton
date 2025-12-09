const app = getApp()

Page({
  data: {
    msgList: [],
    unreadCount: 0,
  },

  onLoad: function (options) {
    // 初始化消息数据
    this.initMessageData();
  },

  onShow: function () {
    // 刷新消息列表
    this.loadMessageList();
  },

  /**
   * 初始化消息数据（mock数据）
   */
  initMessageData: function () {
    // 检查本地是否已有消息数据
    const savedMessages = wx.getStorageSync('messageList');
    if (savedMessages && savedMessages.length > 0) {
      this.setData({
        msgList: savedMessages
      });
      this.updateUnreadCount();
      return;
    }

    // 如果没有，则初始化mock数据
    const mockMessages = [
      {
        id: 1,
        title: '活动报名成功',
        content: '您已成功报名参加"周末羽毛球友谊赛"活动，活动时间为本周六下午2:00-4:00，请准时参加。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 30)), // 30分钟前
        type: 'activity',
        isRead: false,
        relatedId: 'activity_123'
      },
      {
        id: 2,
        title: '订单状态更新',
        content: '您的订单(编号:ORD202401150001)已完成支付，场馆预订成功。我们将为您预留场地，请提前15分钟到达。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 60)), // 1小时前
        type: 'order',
        isRead: false,
        relatedId: 'order_202401150001'
      },
      {
        id: 3,
        title: '积分到账通知',
        content: '恭喜您获得100积分奖励！积分可用于兑换场馆优惠券或商品，感谢您的参与。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 60 * 2)), // 2小时前
        type: 'points',
        isRead: false,
        relatedId: 'points_202401150001'
      },
      {
        id: 4,
        title: '系统公告',
        content: '为了给您提供更好的服务，我们将于本周日凌晨2:00-4:00进行系统维护升级，期间可能会影响部分功能的使用，请提前做好安排。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 60 * 12)), // 12小时前
        type: 'system',
        isRead: true,
        relatedId: 'notice_202401150001'
      },
      {
        id: 5,
        title: '订单状态更新',
        content: '您的订单(编号:ORD202401140002)已消费完成，感谢您的光临！期待您的再次惠顾。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 60 * 24)), // 1天前
        type: 'order',
        isRead: true,
        relatedId: 'order_202401140002'
      },
      {
        id: 6,
        title: '活动提醒',
        content: '温馨提醒：您报名的"羽毛球基础训练班"将于明天下午3:00开始，请携带相关装备准时参加。',
        createTime: this.formatTime(new Date(Date.now() - 1000 * 60 * 60 * 48)), // 2天前
        type: 'activity',
        isRead: true,
        relatedId: 'activity_456'
      }
    ];

    // 保存到本地存储
    wx.setStorageSync('messageList', mockMessages);

    this.setData({
      msgList: mockMessages
    });

    this.updateUnreadCount();
  },

  /**
   * 加载消息列表
   */
  loadMessageList: function () {
    const messages = wx.getStorageSync('messageList') || [];

    this.setData({
      msgList: messages
    });

    this.updateUnreadCount();
  },

  /**
   * 更新未读消息数量
   */
  updateUnreadCount: function () {
    const unreadCount = this.data.msgList.filter(msg => !msg.isRead).length;

    this.setData({
      unreadCount: unreadCount
    });

    // 可以在这里更新全局的未读消息数量，以便在首页显示
    app.globalData.unreadMessageCount = unreadCount;
  },

  /**
   * 查看消息详情（标记为已读）
   */
  viewMessage: function (e) {
    const messageId = e.currentTarget.dataset.id;
    this.markMessageAsRead(messageId);
  },

  /**
   * 标记消息为已读
   */
  markMessageAsRead: function (messageId) {
    const messages = [...this.data.msgList];
    const messageIndex = messages.findIndex(msg => msg.id === messageId);

    if (messageIndex !== -1 && !messages[messageIndex].isRead) {
      messages[messageIndex].isRead = true;

      this.setData({
        msgList: messages
      });

      this.updateUnreadCount();

      // 保存到本地存储
      wx.setStorageSync('messageList', messages);
    }
  },

  /**
   * 标记所有消息为已读
   */
  markAllAsRead: function () {
    const messages = [...this.data.msgList];
    const hasUnreadMessages = messages.some(msg => !msg.isRead);

    if (!hasUnreadMessages) {
      wx.showToast({
        title: '暂无未读消息',
        icon: 'none'
      });
      return;
    }

    // 标记所有消息为已读
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isRead: true
    }));

    this.setData({
      msgList: updatedMessages
    });

    this.updateUnreadCount();

    // 保存到本地存储
    wx.setStorageSync('messageList', updatedMessages);

    wx.showToast({
      title: '已全部标记为已读',
      icon: 'success'
    });
  },

  /**
   * 删除消息
   */
  deleteMessage: function (e) {
    const messageId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      success: (res) => {
        if (res.confirm) {
          this.performDeleteMessage(messageId);
        }
      }
    });
  },

  /**
   * 执行删除消息操作
   */
  performDeleteMessage: function (messageId) {
    const messages = [...this.data.msgList];
    const updatedMessages = messages.filter(msg => msg.id !== messageId);

    this.setData({
      msgList: updatedMessages
    });

    this.updateUnreadCount();

    // 保存到本地存储
    wx.setStorageSync('messageList', updatedMessages);

    wx.showToast({
      title: '删除成功',
      icon: 'success'
    });
  },

  /**
   * 清空所有消息
   */
  clearAllMessages: function () {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有消息吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          this.performClearAllMessages();
        }
      }
    });
  },

  /**
   * 执行清空所有消息操作
   */
  performClearAllMessages: function () {
    this.setData({
      msgList: []
    });

    this.updateUnreadCount();

    // 保存到本地存储
    wx.setStorageSync('messageList', []);

    wx.showToast({
      title: '已清空所有消息',
      icon: 'success'
    });
  },

  /**
   * 滑动关闭事件处理
   */
  onSwipeClose: function (e) {
    // 可以在这里处理滑动关闭后的逻辑
  },

  /**
   * 格式化时间
   */
  formatTime: function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    // 如果是今天，则显示"HH:MM"
    const today = new Date();
    if (year === today.getFullYear() &&
        month === today.getMonth() + 1 &&
        day === today.getDate()) {
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // 如果是昨天，则显示"昨天 HH:MM"
    const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
    if (year === yesterday.getFullYear() &&
        month === yesterday.getMonth() + 1 &&
        day === yesterday.getDate()) {
      return `昨天 ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // 其他情况显示"MM-DD HH:MM"
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
})