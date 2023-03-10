// 问卷列表
let surveys = [];

// 从本地存储中获取问卷列表
if (localStorage.getItem('surveyList')) {
  surveys = JSON.parse(localStorage.getItem('surveyList'));
}

// 问卷对象
class Survey {
  constructor(title, questions) {
    this.title = title;
    this.questions = questions;
  }
}

// 问题对象
class Question {
  constructor(type, title, options) {
    this.type = type;
    this.title = title;
    this.options = options;
  }
}

// 添加问卷
function addSurvey() {
  const title = prompt('请输入问卷标题');
  if (title) {
    const questions = [];
    while (true) {
      const type = prompt('请输入问题类型（单选：1，多选：2，文本：3），取消添加问题请直接点击取消');
      if (!type) {
        break;
      }
      if (type !== '1' && type !== '2' && type !== '3') {
        alert('问题类型只能为1、2、3中的一个，请重新输入');
        continue;
      }
      const questionTitle = prompt('请输入问题标题');
      if (!questionTitle) {
        break;
      }
      const options = [];
      if (type === '1' || type === '2') {
        while (true) {
          const option = prompt('请输入选项，取消添加选项请直接点击取消');
          if (!option) {
            break;
          }
          options.push(option);
        }
        if (options.length === 0) {
          alert('请至少添加一个选项');
          continue;
        }
      }
      questions.push(new Question(type, questionTitle, options));
    }
    surveys.push(new Survey(title, questions));
    localStorage.setItem('surveyList', JSON.stringify(surveys));
    renderSurveyList();
  }
}

// 删除问卷
function deleteSurvey(index) {
  if (confirm('确认删除该问卷吗？')) {
    surveys.splice(index, 1);
    localStorage.setItem('surveyList', JSON.stringify(surveys));
    renderSurveyList();
  }
}

// 填写问卷
function fillSurvey(index) {
  const survey = surveys[index];
  const html = `
    <h2>${survey.title}</h2>
    <form>
      ${survey.questions.map((question, i) => `
        <div class="question">
          <p class="title">${i + 1}. ${question.title}</p>
          ${question.type === '1' ? 
            question.options.map(option => `
              <input type="radio" name="question${i}" value="${option}">${option}<br>
            `).join('') : ''}
          ${question.type === '2' ? 
            question.options.map(option => `
              <input type="checkbox" name="question${i}" value="${option}">${option}<br>
            `).join('') : ''}
          ${question.type === '3' ? '<textarea></textarea>' : ''}
        </div>
      `).join('')}
      <button type="submit">提交</button>
    </form>
  `;
  document.getElementById('content').innerHTML = html;
}

// 查看数据
function viewSurveyData(index) {
    const survey = surveys[index];
    const surveyId = index + 1;
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
        data: []
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: []
    };
  
    // 遍历每个问题，生成相应的图表数据
    for (const question of survey.questions) {
      if (question.type === 'single') {
        // 单选题
        const option = {
          name: question.title,
          type: 'bar',
          data: []
        };
        for (const choice of question.choices) {
          option.data.push(data[question.id][choice.id]);
          chartOption.xAxis.data.push(choice.text);
        }
        chartOption.series.push(option);
        chartOption.legend.data.push(question.title);
      } else if (question.type === 'multi') {
        // 多选题
        const option = {
          name: question.title,
          type: 'bar',
          data: []
        };
        for (const choice of question.choices) {
          option.data.push(data[question.id][choice.id]);
          chartOption.xAxis.data.push(choice.text);
        }
        chartOption.series.push(option);
        chartOption.legend.data.push(question.title);
      }
    }
  
    // 使用Echarts渲染图表
    const chartContainer = document.getElementById('chart-container');
    const chart = echarts.init(chartContainer);
    chart.setOption(chartOption);
  
    // 显示数据报告页面
    hideElement(surveyListPage);
    hideElement(fillSurveyPage);
    showElement(viewSurveyDataPage);
  }
  
  // 隐藏元素
  function hideElement(element) {
    element.style.display = 'none';
  }
  
  // 显示元素
  function showElement(element) {
    element.style.display = 'block';
  }
  