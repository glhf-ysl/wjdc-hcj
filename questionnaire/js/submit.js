function qSubmit(){
	this.storage=null
}

qSubmit.prototype.init=function() {
	var obj=new createPage(),
		obj0=new Storage()

	this.storage=obj0
	obj.init(".container")
	this.bindUI()
}
qSubmit.prototype.bindUI=function() {
	var that=this,
		btn=$("button")

	// $("textarea").focus(function() {
	// 	btn[0].disabled=false
	// })
	console.log($("textarea").length)
	btn.click(function() { //移动端tap
		that.submitQ()
	})
}

// obj
// {
// 	title:"大标题",
// 	q:[
// 		{
// 			type:"类型",
// 			opt:[num1,num2,num3]
// 		},
// 		{
// 			type:"类型",
// 			opt:[num1,num2,num3]
// 		}
// 	]
// }
qSubmit.prototype.submitQ=function() { //提交的提示
	if($("textarea").length!==0){
		var str=$("textarea").val().trim()

		if(str===""){
			alert("请填写必填问题")
		}
	}

	var obj,
		title=$("h2").html(),
		index=this.storage.check("*","data",title)
	//console.log(index)

	if(index===-1){ //add
		obj=this.getObj(),
		this.storage.add("*","data",JSON.stringify(obj))
	}else{ //change
		var arr=localStorage.data.split("*"),
			obj=JSON.parse(arr[index]),
			brr=obj.q

		//console.log(obj)
		var eles=$(".question")

		for(var i=0;i<eles.length;i++){
			eles0=$(eles[i]).find("input")

			if(this.findEle(eles[i],"input[type=radio]")){
				this.handler4Radio(eles0,brr[i].opt)
			}
			if(this.findEle(eles[i],"input[type=checkbox]")){
				this.handler4Checkbox(eles0,brr[i].opt)
			}
			if(this.findEle(eles[i],"textarea")){
				this.handler4Textarea(eles[i],brr[i],brr[i].opt)
			}
		}
		//console.log(obj)
		this.storage.change("*","data",JSON.stringify(obj),index)
	}
}
qSubmit.prototype.findEle=function(ele,target) {
	var result=false,l
	l=$(ele).find(target).length
	if(l!==0){
		result=true
	}
	return result
}
qSubmit.prototype.getObj=function() {
	var obj={},
		eles=$(".question"),
		obj0,eles0,ele,str0

	obj.data=$("h2").html()
	obj.q=[]
	for(var i=0;i<eles.length;i++){ //要减少重复
		obj0={}
		eles0=$(eles[i]).find("input")
		obj0.opt=[]

		if(this.findEle(eles[i],"input[type=radio]")){
			obj0.type="radio"
			this.createArr(eles0,obj0.opt)
			this.handler4Radio(eles0,obj0.opt)
		}
		if(this.findEle(eles[i],"input[type=checkbox]")){
			obj0.type="checkbox"
			this.createArr(eles0,obj0.opt)
			this.handler4Checkbox(eles0,obj0.opt)
		}
		if(this.findEle(eles[i],"textarea")){
			obj0.type="textarea"
			this.handler4Textarea(eles[i],obj0,obj0.opt)
		}

		obj.q.push(obj0)
	}

	return obj
}
qSubmit.prototype.createArr=function(eles0,arr) {
	for(var j=0;j<eles0.length;j++){
		arr.push(0)
	}
}
qSubmit.prototype.handler4Radio=function(eles0,arr) {
	for(var j=0;j<eles0.length;j++){
		if(eles0[j].checked){
			arr[j]++
			break
		}
	}
}
qSubmit.prototype.handler4Checkbox=function(eles0,arr) {
	for(var j=0;j<eles0.length;j++){
		if(eles0[j].checked){
			arr[j]++
		}
	}
}
qSubmit.prototype.handler4Textarea=function(ele_,obj0,arr) {
	var ele,str0

	if(this.findEle(ele_,".required")){
		arr[0]++ //part
		arr[1]++ //total
	}else{
		ele=$(ele_).find("textarea")[0],
		str0=$(ele).val().trim()
		if(str0!==""){
			arr[0]++ //part
		}
		arr[1]++ //total
	}
}

var obj=new qSubmit()
obj.init()