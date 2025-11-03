Page({
  data: {
    // 标签数据
    tags: [],
    // 选中的标签
    selectedTag: '',
    // 策略列表数据
    strategyList: []
  },

  onLoad() {
    this.mockTags();
    this.mockStrategyList();
  },

  // 模拟标签数据
  mockTags() {
    const tags = [];
    for (let i = 1; i <= 20; i++) {
      tags.push(`标签${i}`);
    }
    this.setData({
      tags,
      selectedTag: tags[0]
    });
  },

  // 模拟策略列表数据
  mockStrategyList() {
    const strategyList = [];
    for (let i = 1; i <= 30; i++) {
      strategyList.push({
        image: `https://picsum.photos/750/400?random=${Math.ceil(Math.random()*8)}`, // 替换为真实的 CDN 图片 URL
        description: `这是策略描述${i}，内容可能很长，需要换行展示。`
      });
    }
    this.setData({ strategyList });
  },

  // 选择标签事件
  selectTag(event) {
    const selectedTag = event.currentTarget.dataset.tag;
    this.setData({ selectedTag });
  }
});