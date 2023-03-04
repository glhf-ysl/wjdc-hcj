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
        singleChoiceOption.value = 'single-choice';
        singleChoiceOption.innerText = '单选题';
        typeEl.appendChild(singleChoiceOption);

        const multipleChoiceOption = document.createElement('option');
        multipleChoiceOption.value = 'multiple-choice';
        multipleChoiceOption.innerText = '多选题';
        typeEl.appendChild(multipleChoiceOption);

        typeEl.value = question.type;

        // 创建删除问题按钮 DOM 元素
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = '删除问题';
        deleteBtn.addEventListener('click', () => {
            deleteQuestion(questionIndex);
        });

        // 创建选项列表 DOM 元素
        const optionsList = document.createElement('ul');
        optionsList.classList.add('options-list');

        // 创建选项 DOM 元素
        question.options.forEach((option, optionIndex) => {
            const optionEl = document.createElement('li');
            optionEl.classList.add('option');

            // 创建选项标签 DOM 元素
            const labelEl = document.createElement('input');
            labelEl.type = 'text';
            labelEl.placeholder = '请输入选项标签';
            labelEl.value = option.label;
            labelEl.addEventListener('input', (e) => {
                saveOptionLabel(e, questionIndex, optionIndex);
            });

            // 创建删除选项按钮 DOM 元素
            const deleteOptionBtn = document.createElement('button');
            deleteOptionBtn.innerText = '删除选项';
            deleteOptionBtn.addEventListener('click', () => {
                deleteOption(questionIndex, optionIndex);
            });

            optionEl.appendChild(labelEl);
            optionEl.appendChild(deleteOptionBtn);
            optionsList.appendChild(optionEl);
        });

        // 创建添加选项按钮 DOM 元素
        const addOptionBtn = document.createElement('button');
        addOptionBtn.innerText = '添加选项';
        addOptionBtn.addEventListener('click', () => {
            addOption(questionIndex);
        });

        questionEl.appendChild(titleEl);
        questionEl.appendChild(typeEl);
        questionEl.appendChild(deleteBtn);
        questionEl.appendChild(optionsList);
        questionEl.appendChild(addOptionBtn);
        questionsList.appendChild(questionEl);
    });
}

// 初始化
function init() {
    const currentSurveyStr = localStorage.getItem('currentSurvey');

    if (currentSurveyStr) {
        currentSurvey = JSON.parse(currentSurveyStr);
    }

    renderQuestions();
}

init();
