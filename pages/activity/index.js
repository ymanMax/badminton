const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    show: false, // 参加活动弹窗
    showRatingModal: false, // 评分弹窗
    curInfo: {}, // 当前活动信息
    curRating: 0, // 当前选择的评分
    curComment: '', // 当前输入的评论内容
    listData: [], // 活动列表数据
    venueOptions: [], // 场馆选项
    selectedVenue: '0', // 选中的场馆索引
    activeIndex: '', // 活动类型
    expandedComments: {}, // 记录哪些活动的评论区域已展开
    commentPageSize: 2 // 评论每页显示数量
  },
  onShow() {
    this.getDict();
  },
  getDict() {
    // Mock场馆选项数据
    const tempArr = [
      { dictLabel: '羽毛球馆', dictValue: '1' },
      { dictLabel: '乒乓球馆', dictValue: '2' },
      { dictLabel: '篮球场', dictValue: '3' }
    ];

    this.setData({
      venueOptions: tempArr,
      activeIndex: tempArr[0].dictValue,
    });

    this.getListData();
  },
  getListData() {
    // Mock 30条活动数据
    const mockData = this.generateMockData(30);

    this.setData({
      allPage: 1,
      currentPage: 1,
      listData: mockData,
    });
  },

  // 生成mock活动数据
  generateMockData(count) {
    const data = [];
    const activityNames = [
      '羽毛球友谊赛', '周末羽球聚会', '高手交流赛', '新手训练营', '羽球挑战赛',
      '团体对抗赛', '混合双打赛', '单打精英赛', '羽球嘉年华', '业余爱好者联赛'
    ];
    const descriptions = [
      '欢迎各位羽球爱好者参加，以球会友，共同进步！',
      '周末放松好去处，羽球场上见真章！',
      '高手云集，切磋技艺，共同提高！',
      '新手入门指导，基础动作训练，快速上手！',
      '挑战自我，突破极限，谁是真正的羽球王者？'
    ];

    for (let i = 1; i <= count; i++) {
      const now = new Date();
      const startDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      // 为每个活动生成一些初始评论和评分
      const comments = this.generateMockComments(Math.floor(Math.random() * 10) + 1);
      const avgRating = comments.length > 0 ?
        (comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length).toFixed(1) :
        '暂无评分';

      data.push({
        id: `activity_${i}`,
        name: activityNames[Math.floor(Math.random() * activityNames.length)] + ` ${i}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        image: `/images/activity_${(i % 5) + 1}.png`, // 假设有5张活动图片
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        startTm: this.formatDate(startDate),
        endTm: this.formatDate(endDate),
        peopleNum: Math.floor(Math.random() * 20) + 10, // 10-30人
        applyNum: Math.floor(Math.random() * 20) + 10, // 默认用户已报名，报名数等于或接近总人数
        maxNum: false, // 默认未报满
        comments: comments, // 评论列表
        avgRating: avgRating, // 平均评分
        commentCount: comments.length // 评论数量
      });
    }

    return data;
  },

  // 生成mock评论数据
  generateMockComments(count) {
    const comments = [];
    const userNames = [
      '羽毛球爱好者', '羽球高手', '小球童', '球场飞人', '羽球达人',
      '扣杀王', '网前小王子', '后场霸主', '羽球新星', '球场老将'
    ];
    const commentContents = [
      '活动组织得很好，场地也不错！',
      '大家打得都很尽兴，期待下次活动！',
      '高手很多，学到了不少技巧！',
      '新手表示很友好，很快就融入了！',
      '活动很成功，希望经常举办！',
      '场地条件不错，氛围也很好！',
      '认识了很多新朋友，开心！',
      '组织者很用心，细节做得很好！',
      '水平很高，打得很过瘾！',
      '非常棒的活动，下次一定参加！'
    ];

    for (let i = 1; i <= count; i++) {
      const commentDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      comments.push({
        id: `comment_${Date.now()}_${i}`,
        userId: `user_${i}`,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        rating: Math.floor(Math.random() * 5) + 1, // 1-5星
        content: commentContents[Math.floor(Math.random() * commentContents.length)],
        createTime: commentDate.toISOString(),
        createTm: this.formatDate(commentDate) + ' ' + commentDate.toTimeString().slice(0, 5)
      });
    }

    // 按时间倒序排列，最新的评论在前面
    return comments.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
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
    // 模拟报名成功
    app.toast('报名成功');
  },

  // 打开评分弹窗
  openRatingModal(e) {
    const { activity } = e.currentTarget.dataset;
    this.setData({
      showRatingModal: true,
      curInfo: activity,
      curRating: 0,
      curComment: ''
    });
  },

  // 关闭评分弹窗
  closeRatingModal() {
    this.setData({
      showRatingModal: false,
      curRating: 0,
      curComment: ''
    });
  },

  // 选择评分
  selectRating(e) {
    const { rating } = e.currentTarget.dataset;
    this.setData({
      curRating: rating
    });
  },

  // 输入评论内容
  inputComment(e) {
    const { value } = e.detail;
    this.setData({
      curComment: value
    });
  },

  // 提交评分和评论
  submitRating() {
    const { curRating, curComment, curInfo, listData } = this.data;

    // 验证评分
    if (curRating === 0) {
      app.toast('请选择评分');
      return;
    }

    // 验证评论字数
    const commentLength = curComment.trim().length;
    if (commentLength < 10 || commentLength > 500) {
      app.toast('评论内容需在10-500字之间');
      return;
    }

    // 创建新评论
    const newComment = {
      id: `comment_${Date.now()}`,
      userId: 'current_user',
      userName: '当前用户',
      rating: curRating,
      content: curComment.trim(),
      createTime: new Date().toISOString(),
      createTm: this.formatDate(new Date()) + ' ' + new Date().toTimeString().slice(0, 5)
    };

    // 更新活动数据
    const updatedListData = listData.map(activity => {
      if (activity.id === curInfo.id) {
        // 添加新评论到评论列表开头
        const updatedComments = [newComment, ...activity.comments];

        // 重新计算平均评分
        const totalRating = updatedComments.reduce((sum, comment) => sum + comment.rating, 0);
        const avgRating = (totalRating / updatedComments.length).toFixed(1);

        return {
          ...activity,
          comments: updatedComments,
          avgRating: avgRating,
          commentCount: updatedComments.length
        };
      }
      return activity;
    });

    // 更新数据
    this.setData({
      listData: updatedListData,
      showRatingModal: false,
      curRating: 0,
      curComment: ''
    });

    app.toast('评论提交成功');
  },

  // 切换评论区域展开/收起
  toggleComments(e) {
    const { activityId } = e.currentTarget.dataset;
    const { expandedComments } = this.data;

    this.setData({
      [`expandedComments.${activityId}`]: !expandedComments[activityId]
    });
  },
});
