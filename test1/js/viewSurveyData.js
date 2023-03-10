// 获取当前问卷的数据
const surveyId = '1'; // 假设当前问卷的ID为1
const data = JSON.parse(localStorage.getItem(`surveyData_${surveyId}`));

// 生成图表配置项
const chartOption = {
  title: {
    text: '问卷数据报告'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['单选题', '多选题']
  },
  xAxis: {
    type: 'category',
    data: ['问题1', '问题2', '问题3']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
      name: '单选题',
      type: 'bar',
      data: [data.question1.answer1, data.question2.answer1, data.question3.answer1]
    },
    {
      name: '多选题',
      type: 'bar',
      data: [data.question1.answer2, data.question2.answer2, data.question3.answer2]
    }
  ]
};

// 使用Echarts渲染图表
const chartContainer = document.getElementById('chart-container');
const chart = echarts.init(chartContainer);
chart.setOption(chartOption);
