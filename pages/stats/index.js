// pages/stats/index.js
import * as echarts from 'echarts-for-weixin';

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    selectedVenue: '',
    venues: ['场馆A', '场馆B', '场馆C', '场馆D'],
    chartType: 'bar', // 默认显示柱状图
    yearData: {
      // 模拟按年统计数据
      2023: {
        1: { '场馆A': 15, '场馆B': 20, '场馆C': 18, '场馆D': 25 },
        2: { '场馆A': 18, '场馆B': 22, '场馆C': 20, '场馆D': 28 },
        3: { '场馆A': 20, '场馆B': 25, '场馆C': 22, '场馆D': 30 },
        4: { '场馆A': 22, '场馆B': 28, '场馆C': 25, '场馆D': 32 },
        5: { '场馆A': 25, '场馆B': 30, '场馆C': 28, '场馆D': 35 },
        6: { '场馆A': 28, '场馆B': 32, '场馆C': 30, '场馆D': 38 },
        7: { '场馆A': 30, '场馆B': 35, '场馆C': 32, '场馆D': 40 },
        8: { '场馆A': 32, '场馆B': 38, '场馆C': 35, '场馆D': 42 },
        9: { '场馆A': 28, '场馆B': 32, '场馆C': 30, '场馆D': 38 },
        10: { '场馆A': 25, '场馆B': 30, '场馆C': 28, '场馆D': 35 },
        11: { '场馆A': 22, '场馆B': 28, '场馆C': 25, '场馆D': 32 },
        12: { '场馆A': 20, '场馆B': 25, '场馆C': 22, '场馆D': 30 }
      },
      2024: {
        1: { '场馆A': 18, '场馆B': 22, '场馆C': 20, '场馆D': 28 },
        2: { '场馆A': 20, '场馆B': 25, '场馆C': 22, '场馆D': 30 },
        3: { '场馆A': 22, '场馆B': 28, '场馆C': 25, '场馆D': 32 },
        4: { '场馆A': 25, '场馆B': 30, '场馆C': 28, '场馆D': 35 },
        5: { '场馆A': 28, '场馆B': 32, '场馆C': 30, '场馆D': 38 },
        6: { '场馆A': 30, '场馆B': 35, '场馆C': 32, '场馆D': 40 },
        7: { '场馆A': 32, '场馆B': 38, '场馆C': 35, '场馆D': 42 },
        8: { '场馆A': 35, '场馆B': 40, '场馆C': 38, '场馆D': 45 },
        9: { '场馆A': 32, '场馆B': 38, '场馆C': 35, '场馆D': 42 },
        10: { '场馆A': 28, '场馆B': 32, '场馆C': 30, '场馆D': 38 },
        11: { '场馆A': 25, '场馆B': 30, '场馆C': 28, '场馆D': 35 },
        12: { '场馆A': 22, '场馆B': 28, '场馆C': 25, '场馆D': 32 }
      }
    },
    monthData: {
      // 模拟按月统计数据
      2024: {
        5: {
          '场馆A': [12, 8, 15, 10, 20, 18, 16, 14, 18, 22, 20, 15, 10, 18, 20, 25, 22, 18, 15, 10, 18, 20, 22, 18, 15, 10, 18, 20, 22, 18],
          '场馆B': [15, 12, 18, 15, 22, 20, 18, 16, 20, 25, 22, 18, 15, 20, 22, 28, 25, 22, 18, 15, 20, 22, 25, 22, 18, 15, 20, 22, 25, 22],
          '场馆C': [10, 8, 12, 10, 18, 15, 14, 12, 16, 20, 18, 14, 10, 16, 18, 22, 20, 16, 14, 10, 16, 18, 20, 18, 14, 10, 16, 18, 20, 18],
          '场馆D': [20, 15, 22, 18, 25, 22, 20, 18, 22, 28, 25, 20, 18, 22, 25, 30, 28, 25, 20, 18, 22, 25, 28, 25, 20, 18, 22, 25, 28, 25]
        },
        6: {
          '场馆A': [15, 10, 18, 12, 22, 20, 18, 16, 20, 25, 22, 18, 15, 20, 22, 28, 25, 22, 18, 15, 20, 22, 25, 22, 18, 15, 20, 22, 25, 22],
          '场馆B': [18, 15, 20, 18, 25, 22, 20, 18, 22, 28, 25, 20, 18, 22, 25, 30, 28, 25, 20, 18, 22, 25, 28, 25, 20, 18, 22, 25, 28, 25],
          '场馆C': [12, 10, 15, 12, 20, 18, 16, 14, 18, 22, 20, 16, 12, 18, 20, 25, 22, 18, 16, 12, 18, 20, 22, 20, 16, 12, 18, 20, 22, 20],
          '场馆D': [22, 18, 25, 20, 28, 25, 22, 20, 25, 30, 28, 22, 20, 25, 28, 32, 30, 28, 22, 20, 25, 28, 30, 28, 22, 20, 25, 28, 30, 28]
        }
      }
    },
    monthPeopleData: {
      // 模拟每月各场馆预约人数占比
      2024: {
        5: { '场馆A': 150, '场馆B': 180, '场馆C': 120, '场馆D': 200 },
        6: { '场馆A': 180, '场馆B': 200, '场馆C': 150, '场馆D': 220 }
      }
    }
  },

  onReady: function() {
    // 获取ec-canvas组件
    this.ecComponent = this.selectComponent('#mychart-dom');
    // 初始化图表
    this.initChart();
  },

  initChart: function() {
    if (!this.ecComponent) {
      wx.showToast({
        title: '图表组件未找到',
        icon: 'none'
      });
      return;
    }
    
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 初始化echarts实例
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // 像素比
      });
      
      // 根据当前选择的图表类型更新数据
      this.updateChart(chart);
      
      // 返回图表实例
      return chart;
    });
  },

  updateChart: function(chart) {
    let option;
    
    if (this.data.chartType === 'bar') {
      // 柱状图 - 按年统计每月各场馆预约数量
      const yearData = this.data.yearData[this.data.year];
      const months = Object.keys(yearData).map(month => parseInt(month));
      const venueData = this.data.venues.map(venue => {
        return months.map(month => yearData[month][venue]);
      });
      
      option = {
        title: {
          text: `${this.data.year}年各场馆月度预约数量统计`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: this.data.venues,
          orient: 'horizontal',
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: months.map(month => `${month}月`)
        },
        yAxis: {
          type: 'value',
          name: '预约数量'
        },
        series: this.data.venues.map((venue, index) => ({
          name: venue,
          type: 'bar',
          data: venueData[index]
        }))
      };
    } else if (this.data.chartType === 'line') {
      // 折线图 - 按月统计某场馆每天预约数量
      if (!this.data.selectedVenue) {
        wx.showToast({
          title: '请选择场馆',
          icon: 'none'
        });
        return;
      }
      
      const monthData = this.data.monthData[this.data.year][this.data.month];
      if (!monthData) {
        wx.showToast({
          title: '暂无该月数据',
          icon: 'none'
        });
        return;
      }
      
      const days = Array.from({ length: monthData[this.data.selectedVenue].length }, (_, i) => i + 1);
      const data = monthData[this.data.selectedVenue];
      
      option = {
        title: {
          text: `${this.data.year}年${this.data.month}月${this.data.selectedVenue}预约数量统计`,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [this.data.selectedVenue],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: days.map(day => `${day}日`),
          axisLabel: {
            interval: 3
          }
        },
        yAxis: {
          type: 'value',
          name: '预约数量'
        },
        series: [{
          name: this.data.selectedVenue,
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 6
        }]
      };
    } else if (this.data.chartType === 'pie') {
      // 饼状图 - 按月统计各场馆预约人数占比
      const peopleData = this.data.monthPeopleData[this.data.year][this.data.month];
      if (!peopleData) {
        wx.showToast({
          title: '暂无该月数据',
          icon: 'none'
        });
        return;
      }
      
      const data = Object.keys(peopleData).map(venue => ({
        name: venue,
        value: peopleData[venue]
      }));
      
      option = {
        title: {
          text: `${this.data.year}年${this.data.month}月各场馆预约人数占比`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          data: Object.keys(peopleData)
        },
        series: [{
          name: '预约人数',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '14',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: data
        }]
      };
    }
    
    // 设置图表选项
    chart.setOption(option);
  },

  // 切换图表类型
  changeChartType: function(e) {
    this.setData({
      chartType: e.currentTarget.dataset.type
    });
    this.initChart();
  },

  // 选择年份
  bindYearChange: function(e) {
    this.setData({
      year: parseInt(e.detail.value)
    });
    this.initChart();
  },

  // 选择月份
  bindMonthChange: function(e) {
    this.setData({
      month: parseInt(e.detail.value)
    });
    this.initChart();
  },

  // 选择场馆
  bindVenueChange: function(e) {
    this.setData({
      selectedVenue: this.data.venues[e.detail.value]
    });
    if (this.data.chartType === 'line') {
      this.initChart();
    }
  }
})