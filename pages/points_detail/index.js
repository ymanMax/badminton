const app = getApp()

Page({
  data: {
    pointsBalance: 0, // 积分余额
    pointsList: [], // 积分明细列表
    loading: false, // 是否正在加载
    hasMore: true, // 是否还有更多数据
    page: 1, // 当前页数
    pageSize: 10, // 每页数据量
  },

  onLoad() {
    // 初始化时获取积分余额和第一页明细
    this.getPointsBalance()
    this.loadPointsList()
  },

  onShow() {
    // 页面显示时，重新获取积分余额，确保数据最新
    this.getPointsBalance()
  },

  onPullDownRefresh() {
    // 下拉刷新，重新获取第一页数据
    this.refreshPointsList()
  },

  onReachBottom() {
    // 上拉触底，加载更多数据
    this.loadMorePointsList()
  },

  /**
   * 获取用户积分余额
   */
  getPointsBalance() {
    // 模拟请求，实际项目中应该调用真实接口
    app.request('post', 'applet/user/getPointsBalance', {}, (res) => {
      if (res.code == '0000') {
        this.setData({
          pointsBalance: res.data.pointsBalance || 0
        })
        return
      }
      app.toast(res.msg)
    }, () => {
      // 如果接口请求失败，使用mock数据
      this.setData({
        pointsBalance: this.generateMockPointsBalance()
      })
    })
  },

  /**
   * 加载积分明细列表
   */
  loadPointsList() {
    this.setData({ loading: true })

    // 模拟请求，实际项目中应该调用真实接口
    app.request('post', 'applet/user/getPointsList', {
      page: this.data.page,
      pageSize: this.data.pageSize
    }, (res) => {
      wx.stopPullDownRefresh()

      if (res.code == '0000') {
        const pointsList = res.data.list || []
        const hasMore = pointsList.length === this.data.pageSize

        this.setData({
          pointsList: this.data.page === 1 ? pointsList : [...this.data.pointsList, ...pointsList],
          hasMore: hasMore,
          loading: false
        })

        // 如果是第一页且没有数据，显示空状态
        if (this.data.page === 1 && pointsList.length === 0) {
          wx.showToast({
            title: '暂无积分明细',
            icon: 'none'
          })
        }

        return
      }

      app.toast(res.msg)
      this.setData({ loading: false })
    }, () => {
      // 如果接口请求失败，使用mock数据
      wx.stopPullDownRefresh()

      const mockPointsList = this.generateMockPointsList(this.data.page, this.data.pageSize)
      const hasMore = this.data.page < 5 // 模拟有5页数据

      this.setData({
        pointsList: this.data.page === 1 ? mockPointsList : [...this.data.pointsList, ...mockPointsList],
        hasMore: hasMore,
        loading: false
      })
    })
  },

  /**
   * 刷新积分明细列表（下拉刷新）
   */
  refreshPointsList() {
    this.setData({
      page: 1,
      pointsList: [],
      hasMore: true
    })
    this.loadPointsList()
  },

  /**
   * 加载更多积分明细（上拉触底）
   */
  loadMorePointsList() {
    if (this.data.loading || !this.data.hasMore) {
      return
    }

    this.setData({
      page: this.data.page + 1
    })
    this.loadPointsList()
  },

  /**
   * 生成模拟积分余额
   */
  generateMockPointsBalance() {
    // 生成一个1000-5000之间的随机积分余额
    return Math.floor(Math.random() * 4000) + 1000
  },

  /**
   * 生成模拟积分明细数据
   * @param {number} page - 当前页数
   * @param {number} pageSize - 每页数据量
   * @returns {Array} 模拟的积分明细数据
   */
  generateMockPointsList(page, pageSize) {
    const pointsTypes = ['ACTIVITY', 'PURCHASE', 'SIGN_IN', 'SHARE', 'REFUND', 'EXCHANGE']
    const mockData = []

    // 计算当前页的起始索引
    const startIndex = (page - 1) * pageSize

    for (let i = startIndex; i < startIndex + pageSize; i++) {
      // 随机选择积分变动类型
      const type = pointsTypes[Math.floor(Math.random() * pointsTypes.length)]

      // 根据类型生成不同的积分变动金额
      let amount
      switch (type) {
        case 'ACTIVITY':
          amount = Math.floor(Math.random() * 200) + 100 // 参与活动获得100-300积分
          break
        case 'PURCHASE':
          amount = -Math.floor(Math.random() * 100) - 50 // 购买商品消耗50-150积分
          break
        case 'SIGN_IN':
          amount = Math.floor(Math.random() * 50) + 20 // 每日签到获得20-70积分
          break
        case 'SHARE':
          amount = Math.floor(Math.random() * 80) + 30 // 分享推广获得30-110积分
          break
        case 'REFUND':
          amount = Math.floor(Math.random() * 150) + 50 // 订单退款返还50-200积分
          break
        case 'EXCHANGE':
          amount = -Math.floor(Math.random() * 300) - 100 // 积分兑换消耗100-400积分
          break
        default:
          amount = Math.floor(Math.random() * 100) + 50
      }

      // 生成当前余额（模拟）
      const balance = Math.floor(Math.random() * 5000) + 1000

      // 生成创建时间（当前时间往前推i天）
      const createTime = new Date()
      createTime.setDate(createTime.getDate() - i)
      const createTimeTimestamp = Math.floor(createTime.getTime() / 1000)

      mockData.push({
        id: i + 1, // 唯一标识
        type: type, // 积分变动类型
        amount: amount, // 积分变动金额
        balance: balance, // 变动后的余额
        createTime: createTimeTimestamp, // 创建时间戳
        remark: this.generateMockRemark(type) // 备注信息
      })
    }

    return mockData
  },

  /**
   * 根据积分变动类型生成模拟备注
   * @param {string} type - 积分变动类型
   * @returns {string} 模拟的备注信息
   */
  generateMockRemark(type) {
    switch (type) {
      case 'ACTIVITY':
        return '参与"' + ['羽毛球比赛', '健身活动', '会员日活动', '夏季运动会'][Math.floor(Math.random() * 4)] + '"获得积分'
      case 'PURCHASE':
        return '购买"' + ['羽毛球拍', '运动服', '饮料', '毛巾'][Math.floor(Math.random() * 4)] + '"消耗积分'
      case 'SIGN_IN':
        return '第' + (Math.floor(Math.random() * 30) + 1) + '天签到获得积分'
      case 'SHARE':
        return '分享"' + ['活动页面', '商品链接', '健身教程'][Math.floor(Math.random() * 3)] + '"获得积分'
      case 'REFUND':
        return '订单"' + ['202401010001', '202401020002', '202401030003'][Math.floor(Math.random() * 3)] + '"退款返还积分'
      case 'EXCHANGE':
        return '兑换"' + ['优惠券', '运动器材', '饮料券'][Math.floor(Math.random() * 3)] + '"消耗积分'
      default:
        return '积分变动'
    }
  }
})