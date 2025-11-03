const app = getApp();

Page({
  data: {
    imgHost: app.globalData.imgHost,
    showDatetimePop: false,
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    filter(type, options) {
      if (type === "minute") {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
    currentDate: new Date().getTime(),
    currentDate1: new Date().getTime(),
    endTime: "",
    startTime: "",
    time: "",
    time1: "",
    minDate: new Date().getTime(),
    rangeList: [],
    rangeList1: [],
    activityType: '',
    activityIndex: '',
    activityType1: '',
    activityIndex1: '',
  },
  onLoad: function (options) {
    this.getDict();
    this.getListData();
  },
  onShow: function () {},
  getListData() {
    app.request('post', 'applet/badminton/stadium/getPageList', {
      page: {
        pages: 0,
        size: 200
      },
      query: {}
    }, (res) => {
      if (res.code == '0000') {
        const {
          records,
        } = res.data;
        this.setData({
          rangeList1: records,
        });
        return;
      }
      app.toast(res.msg);
    });
  },
  getDict() {
    app.request('post', 'common/getDictTypeList', {}, (res) => {
      if (res.code == '0000') {
        const tempArr = res.data.find(item => item.dictCode == 'activity_type').dictDataModelList || [];
        this.setData({
          rangeList: tempArr,
        });
        return;
      }
      app.toast(res.msg);
    });
  },
  previewImg(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
        showmenu: false,
        urls: [url], // 需要预览的图片 http 链接列表
    });
  },
  chooseImg() {
    wx.chooseImage({
      count: 1, // 最多9张[7](@ref)
      sizeType: ['compressed'], // 压缩图片[6](@ref)
      success: async (res) => {
        this.uploadImg(res.tempFilePaths[0])
      }
    })
  },
  async uploadImg(imgUrl) {
    await wx.uploadFile({
      url: 'http://111.229.213.248:7012/common/uploadImage',
      filePath: imgUrl,
      name: 'file',
      success: (res) => {
        const {
          code,
          data,
          msg
        } = JSON.parse(res.data);
        if (code != '0000') return app.toast(msg)
        this.setData({
          actImg: data
        })
      },
    })
  },
  createAct() {
    app.request(
      "post",
      "applet/badminton/activity/createActivity",
      {
        query: {},
        page: {
          size: 999,
          current: 1,
        },
      },
      (res) => {
        if (res.code == "0000") {
          this.setData({
            persionNum: res.data.records || [],
          });
          return;
        }
        app.toast(res.data);
      }
    );
  },
  async submit() {
    const { title, num, startTime, endTime, descp, activityType, activityType1, actImg } = this.data;
    if (!actImg) {
      wx.showToast({
        title: "请上传活动图片",
        icon: "none",
      });
      return;
    }
    if (!title) {
      wx.showToast({
        title: "请填写活动名称",
        icon: "none",
      });
      return;
    }
    if (!descp) {
      wx.showToast({
        title: "请填写活动描述",
        icon: "none",
      });
      return;
    }
    if (!activityType1) {
      wx.showToast({
        title: "请选择活动场馆",
        icon: "none",
      });
      return;
    }
    if (!activityType) {
      wx.showToast({
        title: "请选择活动类型",
        icon: "none",
      });
      return;
    }
    if (!startTime) {
      wx.showToast({
        title: "请选择活动开始时间",
        icon: "none",
      });
      return;
    }
    if (!endTime) {
      wx.showToast({
        title: "请选择活动结束时间",
        icon: "none",
      });
      return;
    }
    if (!num) {
      wx.showToast({
        title: "请填写活动人数",
        icon: "none",
      });
      return;
    }
    if (!/^\d+$/.test(num)) {
      wx.showToast({
        title: "活动人数请输入数字",
        icon: "none",
      });
      return;
    }
    const extJsonStr = {
      name: title,
      description: descp,
      peopleNum: num,
      endTime,
      startTime,
      activityType,
      stadiumId: activityType1,
      image: actImg,
    };
    app.request("post", "applet/badminton/activity/createActivity", extJsonStr, (res) => {
      if (res.code != "0000") {
        wx.showToast({
          title: res.msg,
          icon: "none",
        });
      } else {
        setTimeout(() => wx.navigateBack(), 1500)
      }
    });
  },
  showDatetimePop() {
    this.setData({
      showDatetimePop: true,
    });
  },
  hideDatetimePop() {
    this.setData({
      showDatetimePop: false,
    });
  },
  confirm(e) {
    if (this.data.time1 && e.detail > this.data.time1) {
      app.toast("开始时间不得大于结束时间");
      return;
    }
    this.setData({
      startTime: app.formatTime1(e.detail).split(" ")[0],
      time: e.detail,
    });
    this.hideDatetimePop();
  },

  showDatetimePop1() {
    this.setData({
      showDatetimePop1: true,
    });
  },
  showDatetimePop3() {
    this.setData({
      showDatetimePop3: true,
    });
  },
  showDatetimePop2() {
    this.setData({
      showDatetimePop2: true,
    });
  },
  hideDatetimePop1() {
    this.setData({
      showDatetimePop1: false,
    });
  },
  onConfirm(e) {
    this.setData({
      showDatetimePop2: false,
      activityIndex: e.detail.index,
      activityType: e.detail.value.dictValue,
    });
  },
  onConfirm1(e) {
    this.setData({
      showDatetimePop3: false,
      activityIndex1: e.detail.index,
      activityType1: e.detail.value.id,
    });
  },
  onCancel() {
    this.setData({
      showDatetimePop2: false,
      showDatetimePop3: false,
    });
  },
  confirm1(e) {
    if (this.data.time && e.detail < this.data.time) {
      app.toast("开始时间不得大于结束时间");
      return;
    }
    this.setData({
      endTime: app.formatTime1(e.detail).split(" ")[0],
      time1: e.detail,
    });
    this.hideDatetimePop1();
  },
});
