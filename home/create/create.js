// 获取 DOM 元素
const titleInput = document.getElementById('title-input');
const questionsList = document.getElementById('questions-list');
const addQuestionBtn = document.getElementById('add-question-btn');
const saveBtn = document.getElementById('save-btn');
const publishBtn = document.getElementById('publish-btn');

// 问卷模板
const surveyTemplate = {
  title: '',
  questions: []
};

// 问题模板
const questionTemplate = {
  type: 'single-choice', // 默认为单选题
  title: '',
  options: []
};

// 选项模板
const optionTemplate = {
  label: '',
  value: ''
};

// 当前问卷
let currentSurvey = surveyTemplate;

// 保存标题
titleInput.addEventListener('input', (e) => {
  currentSurvey.title = e.target.value;
});

// 添加问题
addQuestionBtn.addEventListener('click', () => {
  if (currentSurvey.questions.length >= 10) {
    alert('最多只能添加 10 个问题！');
    return;
  }
  
  const question = { ...questionTemplate };
  currentSurvey.questions.push(question);
  
  renderQuestions();
});

// 删除问题
function deleteQuestion(index) {
  currentSurvey.questions.splice(index, 1);
  renderQuestions();
}

// 保存问题标题
function saveQuestionTitle(e, index) {
  currentSurvey.questions[index].title = e.target.value;
}

// 切换问题类型
function toggleQuestionType(e, index) {
  currentSurvey.questions[index].type = e.target.value;
  renderQuestions();
}

// 添加选项
function addOption(questionIndex) {
  const option = { ...optionTemplate };
  currentSurvey.questions[questionIndex].options.push(option);
  renderQuestions();
}

// 删除选项
function deleteOption(questionIndex, optionIndex) {
  currentSurvey.questions[questionIndex].options.splice(optionIndex, 1);
  renderQuestions();
}

// 保存选项
function saveOptionLabel(e, questionIndex, optionIndex) {
  currentSurvey.questions[questionIndex].options[optionIndex].label = e.target.value;
}

// 保存问卷
saveBtn.addEventListener('click', () => {
  localStorage.setItem('currentSurvey', JSON.stringify(currentSurvey));
});

// 发布问卷
publishBtn.addEventListener('click', () => {
  const currentDate = new Date();
  const endDate = new Date(currentSurvey.endDate);
  
  if (endDate < currentDate) {
    alert('截止日期不能早于当前日期！');
    return;
  }
  
  currentSurvey.status = 'published';
  localStorage.setItem('currentSurvey', JSON.stringify(currentSurvey));
});

// 渲染问题列表
function renderQuestions() {
  questionsList.innerHTML = '';
  
  currentSurvey.questions.forEach((question, questionIndex) => {
    // 创建问题 DOM 元素
    const questionEl = document.createElement('li');
    questionEl.classList.add('question');
    
    // 创建问题标题 DOM 元素
    const titleEl = document.createElement('input');
    titleEl.type = 'text';
    titleEl.placeholder = '请输入问题标题';
    titleEl.value = question.title;
    titleEl.addEventListener('input', (e) => {
      saveQuestionTitle(e, questionIndex);
    });
    
    // 创建问题类型 DOM 元素
    const typeEl = document.createElement('select');
    typeEl.addEventListener('change', (e) => {
      toggleQuestionType(e, questionIndex);
    });
    
    const singleChoiceOption = document.createElement('option');
    singleChoiceOption.value = 'single-choice
