//增加有用的提示及完善细节
//选项排序
function CreateQuestion(){
	this.index=1
}
CreateQuestion.prototype.init=function() {
	var arr=window.location.href.split("="),
		index=arr[1]
	//console.log(index)
	if(index){
		this.handler4Edit(index)
	}
	this.bindUI()
}
CreateQuestion.prototype.renderUI=function(className) {
	var str
	switch (true) {
		case /textBtn/.test(className):
			str="<input type='text' value='' placeholder='文本题' class='textInput2' data-type='text'>"
				+"<div class='textInput3Wrap'><input type='checkbox' class='textInput3'>"
				+"<input type='text' value='此题必填' class='textInput4'></div>"
				+"<textarea></textarea>"
			break
		case /radioBtn/.test(className):
			str="<input type='text' value='' placeholder='单选题' class='textInput2' data-type='radio'>"
				+"<div class='addInput'><span class=''>增加选项</span></div>"
				+"<div><input type='radio' name='name' class='radioInput'>"
				+"<input type='text' value='' placeholder='选项1' class='radioInput1 opts'><span class='delInput'>删除选项</span></div>"
				+"<div><input type='radio' name='name' class='radioInput'>"
				+"<input type='text' value='' placeholder='选项2' class='radioInput1 opts'><span class='delInput'>删除选项</span></div>"

			break
		case /checkboxBtn/.test(className):
			str="<input type='text' value='' placeholder='多选题' class='textInput2' data-type='checkbox'>"
				+"<div class='addInput'><span class=''>增加选项</span></div>"
				+"<div><input type='checkbox' name='name' class='checkboxInput'>"
				+"<input type='text' value='' placeholder='选项1' class='checkboxInput1 opts'><span class='delInput'>删除选项</span></div>"
				+"<div><input type='checkbox' name='name' class='checkboxInput'>"
				+"<input type='text' value='' placeholder='选项2' class='checkboxInput1 opts'><span class='delInput'>删除选项</span></div>"
			break
	}
	var str1="<div class='questionWrap'>"
			+"<input type='text' value="+"Q"+this.index+" class='textInput1'>",
		str_="<div class='delWrap'><span class='moveTopQuestion'>上移</span>"
			+"<span class='moveDownQuestion'>下移</span><span class='reuseQuestion'>复用</span>"
			+"<span class='delQuestion'>删除</span></div>"
	$(".addQuestionBtnWrap").before(
		str1
		+str
		+str_
		+"</div>"
	)
	this.index++
}
CreateQuestion.prototype.renderInput=function(target) { //选项全部删除再新增会有问题
	var ele=target.nextSibling.childNodes[0],
		str1,
		str2="<span class='delInput'>删除选项</span></div>",
		str
	switch(ele.type){
		case "radio":
		str1="<div><input type='radio' name='name' class='radioInput'>"
			+"<input type='text' value='选项' class='radioInput1 opts'>"
			break
		case "checkbox":
		str1="<div><input type='checkbox' name='name' class='radioInput'>"
			+"<input type='text' value='选项' class='checkboxInput1 opts'>"
			break
	}
	str=str1+str2
	$(target.parentNode).find(".delWrap").before(str);
}
CreateQuestion.prototype.bindUI=function() {
	var that=this
	$(document).on("click",".questionType",function() { //增加问题
		that.addQuestion(this)
	}).on("mouseenter",".questionWrap",function(event) { //展示工具，mouseenter,mouseover都可以生效
		that.toogleTool(event.target,".delWrap")
	}).on("click",".moveTopQuestion",function() { //上移
		that.handleQuestion(this)
	}).on("click",".moveDownQuestion",function() { //down
		that.handleQuestion(this)
	}).on("click",".reuseQuestion",function() { //copy
		that.handleQuestion(this)
	}).on("click",".delQuestion",function() { //del
		that.handleQuestion(this)
	}).on("mouseenter",".questionWrap",function(event) { 
		that.toogleTool(event.target,".addInput")
	}).on("click",".addInput",function() { //addInput
		that.renderInput(this)
	}).on("mouseenter",".questionWrap",function(event) { 
		that.toogleTool(event.target,".delInput")
	}).on("click",".delInput",function() { //delInput
		that.delInput(this)
	})
}
CreateQuestion.prototype.addQuestion=function(target) {
	var className=target.className,
		that=this
	if(that.checkIndex(0,target)){
		if(className==="radioBtn"||className==="checkboxBtn"||className==="textBtn"){
			alert(className)
			$(".selectedQuestionType").removeClass("selectedQuestionType")
			$(target).addClass("selectedQuestionType")
		}
		that.renderUI(className)
	}
}
CreateQuestion.prototype.toogleTool=function(target,selector) {
	$(target).hover(function() {
		$(target).find(selector).css("visibility","visible")
	}, function() {
		$(target).find(selector).css("visibility","hidden")
	})
}
CreateQuestion.prototype.checkIndex=function(index,target) {
	var l=$(".questionWrap").length

	this.index=l+1

	if(index===0&&target.className==="moveTopQuestion"){
		alert("不能上移")
		return
	}
	if(index+1===l&&target.className==="moveDownQuestion"){
		alert("不能下移")
		return
	}
	if(this.index===2&&/delQuestion/.test(target.className)){
		alert("不能少于一个问题")
		return
	}
	if(this.index===11&&/questionType/.test(target.className)){
		alert("最多十个问题")
		return
	}

	return true
}
CreateQuestion.prototype.getQuestionIndex=function(ele) {
	var eles=$(".questionWrap"),
		index
	for(var i=0;i<eles.length;i++){
		if(eles[i]===ele){
			index=i
			break
		}
	}
	return index
}
CreateQuestion.prototype.handleQuestion=function(target) {
	var eles=$(".questionWrap"),
		ele=target.parentNode.parentNode,
		that=this,
		index=that.getQuestionIndex(ele)
	if(that.checkIndex(index,target)){
		switch(target.className){
			case "moveTopQuestion":
				ele.remove()
				$(ele).insertBefore(eles[index-1])
				break
			case "moveDownQuestion":
				ele.remove()
				$(ele).insertAfter(eles[index+1])
				break
			case "reuseQuestion":
				$(ele.outerHTML).insertAfter(ele)
				that.index++
				break
			case "delQuestion":
				ele.remove()
				that.index--
				break
		}
	}
}
CreateQuestion.prototype.delInput=function(target) {
	$(target.parentNode).remove()
}
CreateQuestion.prototype.handler4Edit=function(index) {
	var arr=localStorage.html.split("*"),
		brr=localStorage.title.split("*"),
		type,
		obj=JSON.parse(brr[index]),
		eles,ele,
		num,content,required,opts
	localStorage["questionnaireTitle"] = obj.title
	$(".container_").html(arr[index])
	eles=$(".questionWrap")

	$(".calWrap")[0].remove()
	$(".calContainer")[0].remove() //怎样更好？

	for(var i=0;i<eles.length;i++){
		ele=$(eles[i])
		num=ele.find(".textInput1").val(obj.q[i].num)
		content=ele.find(".textInput2").val(obj.q[i].q_content)
		required=ele.find(".textInput3")[0]

		if(required){
			required.checked=obj.q[i].required
		}
		
		opts=ele.find(".opts")
		for(var j=0;j<opts.length;j++){
			$(opts[j]).val(obj.q[i].q_opt[j])
		}
	}

	$(".questionnaireTitle").val(obj.title)
		setTimeout(function() {
		$(".dateInput").val(obj.deadline) //有问题，先放下
	},0)
}