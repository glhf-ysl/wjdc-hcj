// 获取DOM元素
const selectAllCheckbox = document.getElementById('selectAll');
const selectCheckboxes = document.querySelectorAll('.selectCheckbox');
const surveyTable = document.getElementById('surveyTable');

// 添加事件监听器
selectAllCheckbox.addEventListener('click', toggleSelectAll);

for (const checkbox of selectCheckboxes) {
    checkbox.addEventListener('click', toggleSelect);
}

surveyTable.addEventListener('click', handleTableClick);

// 全选 / 取消全选
function toggleSelectAll() {
    for (const checkbox of selectCheckboxes) {
        checkbox.checked = selectAllCheckbox.checked;
    }
}

// 单个选择
function toggleSelect() {
    // 判断是否有未选中的checkbox
    const unchecked = document.querySelector('.selectCheckbox:not(:checked)');
    if (unchecked) {
        selectAllCheckbox.checked = false;
    } else {
        selectAllCheckbox.checked = true;
    }
}

// 表格中的操作按钮点击事件处理
function handleTableClick(event) {
    if (event.target.tagName.toLowerCase() === 'button') {
        const button = event.target;
        const row = button.closest('tr');
        const status = row.children[3].textContent;

        if (button.textContent === '编辑') {
            handleEditButton(row);
        } else if (button.textContent === '删除') {
            handleDeleteButton(row);
        } else if (button.textContent === '填写问卷') {
            handleFillButton(status);
        } else if (button.textContent === '查看数据') {
            handleDataButton(status);
        }
    }
}

// 处理编辑按钮点击事件
function handleEditButton(row) {
    const surveyTitle = row.children[1].textContent;
    alert(`你点击了编辑问卷按钮，问卷标题为：${surveyTitle}`);
}

// 处理删除按钮点击事件

function handleDeleteButton(row) {
    const confirmDelete = window.confirm('确认删除该行吗？');
    if (confirmDelete) {
        row.remove();
    }
}


// 处理填写问卷按钮点击事件
function handleFillButton(status) {
    if (status === '未发布') {
        alert('该问卷还未发布，不能填写');
    } else if (status === '已结束') {
        alert('该问卷已结束，不能填写');
    } else {
        alert('你点击了填写问卷按钮');
    }
}

// 处理查看数据按钮点击事件
function handleDataButton(status) {
    if (status === '未发布') {
        alert('该问卷还未发布，不能查看数据');
    } else {
        alert('你点击了查看数据按钮');
    }
}

///////////////////////////////////////////////////////批量删除操作
const batchDeleteButton = document.getElementById('batch-delete-button');
batchDeleteButton.addEventListener('click', batchDelete);
function batchDelete() {
    const selectedRows = [];

    for (const checkbox of selectCheckboxes) {
        if (checkbox.checked) {
            const row = checkbox.closest('tr');
            selectedRows.push(row);
        }
    }

    if (selectedRows.length > 0 && confirm('确定要删除选中的行吗？')) {
        for (const row of selectedRows) {
            row.remove();
        }
    }
}
/////////////////////////////////////////////////////////////

