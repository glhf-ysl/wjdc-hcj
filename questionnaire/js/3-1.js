//增加有用的提示及完善细节
function AddQuestion(){
	this.storage=null
}
AddQuestion.prototype.init=function() {
	this.storage=new Storage()

	this.renderUI()	
	this.bindUI()
}
AddQuestion.prototype.renderUI=function() {
	$(".addQuestionBtn")
	.wrap("<div class='addQuestionBtnWrap'></div>")
	.css("marginBottom",0)
	.before(
		"<button class='questionType radioBtn'>单选</button><button class='questionType checkboxBtn'>多选</button>"
		+"<button class='questionType textBtn'>文本题</button>"
	)
}
AddQuestion.prototype.bindUI=function() {
	var that=this

	$(document).on("click",".publishQuestionnaireBtn",function() { //元素已创建，为啥还要委托？
		that.handler4Publish()
	})
	$(document).on("click",".saveQuestionnaireBtn",function() {
		that.handler4Save()
	})
}
AddQuestion.prototype.handler4Publish=function() {
	var that=this,
		layer
	
	layer=new Layer()

	layer.show({
		title:"提示",
		content:"确认发布问卷吗？"+"\n"+"(此问卷截止日期为"+$(".dateInput")[0].value+")",
		handler4ConfirmBtn:function() {
			that.handler4Save1("发布中")

			window.location.href="index.html"
		},
		handler4CancelBtn:function() {
			layer.hide()
		}
	})
}
AddQuestion.prototype.handler4Save=function() { //如果保存也有弹框，就可以统一格式

	var that=this,layer

	that.handler4Save1("未发布")

	layer=new Layer()
	layer.show({
		title:"提示",
		content:"已保存"
	})

	setTimeout(function () {
		layer.hide()
	},1000)
}
AddQuestion.prototype.handler4Save1=function(state) {
	var that=this,
		obj,str1,str2,result
	if (localStorage["questionnaireTitle"]) {
		result = that.storage.check("*", "title", localStorage["questionnaireTitle"])
		localStorage.removeItem(["questionnaireTitle"])
	}else
		result=that.storage.check("*","title",$(".questionnaireTitle").val())
	obj=that.getObj()
	obj.state=state
	str1=JSON.stringify(obj)
	str2=$(".container_").html()
	if(result===-1 && !localStorage["judge"]){
		that.storage.add("*","title",str1)
		that.storage.add("*","html",str2)
	}else{
		that.storage.change("*","title",str1,result)
		that.storage.change("*","html",str2,result)
	}
	localStorage.removeItem(["judge"])
}
//obj
// {
// 	title:"大标题",
// 	q:[
// 		{
// 			type:"类型",
// 			num:"问题编号",
// 			q_content:"问题内容",
//			q_opt:[123,123],
// 			required:false
// 		},
// 		{
// 			type:"类型",
// 			num:"问题编号",
// 			q_content:"问题内容",
//			q_opt:[null,null],
// 			required:trueORfalse
// 		}
// 	]
// 	time:"当前时间",
// 	state:"保存？发布？",
// 	deadline:"截止日期"
// }
AddQuestion.prototype.getObj=function() {
	var obj={},eles,l,$ele,obj1,$opts,required,date,
		that=this
	
	obj.title=$(".questionnaireTitle").val()
	if (obj.title === "" || obj.title === null){
		obj.title = "默认标题"
	}
	obj.q=[],
	eles=$(".questionWrap")
	l=eles.length

	for(var i=0;i<l;i++){
		$ele=$($(".questionWrap")[i])
		obj1={}
		type=$ele.find(".textInput2").data("type")

		obj1.type=type
		obj1.num=$ele.find(".textInput1").val()
		obj1.q_content=$ele.find(".textInput2").val()
		obj1.q_opt=[]

		$opts=$ele.find(".opts")
		len=$opts.length

		for(var j=0;j<len;j++){
			obj1.q_opt.push($($opts[j]).val())
		}

		if($ele.find(".textInput3")[0]){
			required=$ele.find(".textInput3")[0].checked
			obj1.required=required
		}else {
			obj1.required=false
		}

		obj.q.push(obj1)
	}

	date=new Date()
	//2017-10-27 3:00:00
	var y=date.getFullYear(),
		m=date.getMonth()+1,
		d=date.getDate(),
		h=date.getHours(),
		min=date.getMinutes(),
		s=date.getSeconds(),
		time,
		str=$(".dateInput").val()

	min=that.handleDate(min)
	s=that.handleDate(s)
	time=y+"-"+m+"-"+d+" "+h+":"+min+":"+s

	obj.time=time
	//obj.state=state
	obj.deadline=str

	return obj
}
AddQuestion.prototype.handleDate=function(num) {
	return num<10?"0"+num:num
}