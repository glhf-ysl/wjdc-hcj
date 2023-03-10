// 定义一个问卷类
class Survey {
    constructor(id, title, createTime, status) {
      this.id = id;
      this.title = title;
      this.createTime = createTime;
      this.status = status;
    }
  }
  
  // 定义一个问卷列表类
  class SurveyList {
    constructor() {
      this.surveys = []; // 存放所有问卷的数组
    }
  
    // 添加新问卷
    add(survey) {
      this.surveys.push(survey);
      this.save(); // 保存问卷列表到本地存储
    }
  
    // 删除问卷
    remove(id) {
      const index = this.surveys.findIndex((survey) => survey.id === id);
      if (index !== -1) {
        this.surveys.splice(index, 1);
        this.save(); // 保存问卷列表到本地存储
      }
    }
  
    // 批量删除问卷
    removeBatch(ids) {
      this.surveys = this.surveys.filter((survey) => !ids.includes(survey.id));
      this.save(); // 保存问卷列表到本地存储
    }
  
    // 保存问卷列表到本地存储
    save() {
      localStorage.setItem('surveyList', JSON.stringify(this.surveys));
    }
  
    // 从本地存储中读取问卷列表
    load() {
      const data = localStorage.getItem('surveyList');
      if (data) {
        this.surveys = JSON.parse(data);
      }
    }
  }
  
  // 定义全局变量 surveyList，用于存放问卷列表
  let surveyList = new SurveyList();
  
  // 页面加载完成后执行的初始化函数
  function init() {
    // 从本地存储中读取问卷列表
    surveyList.load();
  
    // 如果问卷列表为空，显示“新建问卷”按钮
    if (surveyList.surveys.length === 0) {
      document.getElementById('empty-list').style.display = 'block';
    }
  
    // 渲染问卷列表
    renderSurveyList();
  
    // 绑定批量删除按钮的点击事件
    const removeBatchBtn = document.getElementById('remove-batch-btn');
    removeBatchBtn.addEventListener('click', onRemoveBatchBtnClick);
  }
  
  // 渲染问卷列表
  function renderSurveyList() {
    const tbody = document.getElementById('survey-list-body');
    tbody.innerHTML = '';
  
    // 遍历所有问卷，生成表格行并添加到 tbody 中
    surveyList.surveys.forEach((survey) => {
      const row = document.createElement('tr');
  
      // 创建问卷标题单元格并添加到行中
      const titleCell = document.createElement('td');
      titleCell.textContent = survey.title;
      row.appendChild(titleCell);
  
      // 创建创建时间单元格并添加到行中
      const createTimeCell = document.createElement('td');
      createTimeCell.textContent = survey.createTime;
      row.appendChild(createTimeCell);
  
    // 创建问卷状态单元格并添加到行中
    const statusCell = document.createElement('td');
    const statusSpan = document.createElement('span');
    statusSpan.textContent = survey.status;
    statusSpan.classList.add('status');
    statusSpan.classList.add(survey.status.toLowerCase().replace(/\s+/g, '-'));
    statusCell.appendChild(statusSpan);
    row.appendChild(statusCell);

    // 创建操作区域单元格并添加到行中
    const actionCell = document.createElement('td');
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action-container');
    actionCell.appendChild(actionContainer);

    // 添加编辑按钮
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => {
      window.location.href = `./edit.html?id=${survey.id}`;
    });
    actionContainer.appendChild(editBtn);

    // 添加删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => {
      deleteSurvey(survey.id);
    });
    actionContainer.appendChild(deleteBtn);

    // 添加填写问卷按钮
    if (survey.status !== '已结束') {
      const fillBtn = document.createElement('button');
      fillBtn.classList.add('fill-btn');
      fillBtn.textContent = '填写问卷';
      fillBtn.addEventListener('click', () => {
        window.open(`./fill.html?id=${survey.id}`);
      });
      actionContainer.appendChild(fillBtn);
    }

    // 添加查看数据按钮
    const dataBtn = document.createElement('button');
    dataBtn.classList.add('data-btn');
    dataBtn.textContent = '查看数据';
    dataBtn.addEventListener('click', () => {
      window.location.href = `./data.html?id=${survey.id}`;
    });
    actionContainer.appendChild(dataBtn);

    row.appendChild(actionCell);
  }

  // 如果没有问卷，则显示新建问卷按钮
  if (surveyList.length === 0) {
    const noSurveyText = document.createElement('p');
    noSurveyText.textContent = '当前没有问卷，请点击下方按钮新建问卷';
    noSurveyText.classList.add('no-survey-text');
    surveyTable.parentNode.insertBefore(noSurveyText, surveyTable.nextSibling);

    const newSurveyBtn = document.createElement('button');
    newSurveyBtn.classList.add('new-survey-btn');
    newSurveyBtn.textContent = '新建问卷';
    newSurveyBtn.addEventListener('click', () => {
      window.location.href = './edit.html';
    });
    surveyTable.parentNode.insertBefore(newSurveyBtn, surveyTable.nextSibling);
  }
}

/**
 * 删除问卷
 * @param {string} id 问卷 id
 */
function deleteSurvey(id) {
  if (window.confirm('确认删除该问卷吗？')) {
    const surveyIndex = surveyList.findIndex(survey => survey.id === id);
    surveyList.splice(surveyIndex, 1);
    saveSurveyList();
    renderSurveyList();
  }
}

renderSurveyList();
function batchDeleteSurveys() {
    const checkedRows = Array.from(document.querySelectorAll('tbody input[type="checkbox"]:checked'))
      .map(checkbox => checkbox.closest('tr'));
  
    if (checkedRows.length === 0) {
      window.alert('请至少选择一个问卷！');
      return;
    }
  
    if (window.confirm(`确认删除选中的 ${checkedRows.length} 个问卷吗？`)) {
      checkedRows.forEach(row => {
        const id = row.dataset.id;
        const surveyIndex = surveyList.findIndex(survey => survey.id === id);
        surveyList.splice(surveyIndex, 1);
      });
      saveSurveyList();
      renderSurveyList();
    }
  }
  
  function init() {
    // 绑定新建问卷按钮点击事件
    const newSurveyButton = document.querySelector('#new-survey-button');
    newSurveyButton.addEventListener('click', createNewSurvey);
  
    // 绑定批量删除按钮点击事件
    const batchDeleteButton = document.querySelector('#batch-delete-button');
    batchDeleteButton.addEventListener('click', batchDeleteSurveys);
  
    // 渲染问卷列表
    renderSurveyList();
  }
  
  init();
  