function CreateList(){
	this.storage=null
}

CreateList.prototype.init=function() {
	this.storage=new Storage()

	this.renderUI()
	this.bindUI()
	this.checkDate()
}
CreateList.prototype.renderUI=function() {
	$(".newQ").addClass("newPos")
	var arr=localStorage.title.split("*"),
		l=arr.length,
		str4="<span class='title_'>标题</span><span class='time_'>时间</span>"
		+"<span class='state_'>状态</span><span class='operate_'>操作</span>",
		str1="<div class='container_'><ul>",
		str2="",
		str3,
		str=$(".container").html(),
		obj

	for(var i=0;i<l;i++){
		if(arr[i]!==""){
			obj=JSON.parse(arr[i])
			str2+="<li><input type='checkbox'>"
			+"<h6>"+obj.title+"</h6>"
			+"<span class='time'>"+obj.time+"</span>"
			if(obj.state==="发布中"){
				str2+="<span class='state publishState'>"+obj.state+"</span>"
					+"<button disabled='true'>编辑</button><button class='del' disabled='true'>删除</button><button class='checkData'>查看数据</button>"
			+"</li>"
			}
			if(obj.state==="未发布"){
				str2+="<span class='state'>"+obj.state+"</span>"
					+"<button class='edit'>编辑</button><button class='del'>删除</button><button disabled='true'>查看数据</button>"
			+"</li>"
			}
			if(obj.state==="已结束"){
				str2+="<span class='state'>"+obj.state+"</span>"
					+"<button disabled='true'>编辑</button><button class='del' disabled='true'>删除</button><button class='checkData'>查看数据</button>"
			+"</li>"
			}
		}
	}
	str2+="</ul>"
	str3="<input type='checkbox' name='q' class='selectAll'><label for='q'>全选</label><button class='delMany'>删除</button>"
		+"</div>"
	$(".container").html(str+str4+str1+str2+str3)
}
CreateList.prototype.bindUI=function() {
	var that=this

	$(".del").click(function() {
		that.handler4Del(this)
	})
	$(".selectAll").click(function() {
		that.handler4Select(this)
	})
	$(".delMany").click(function() {
		that.handler4DelMany()
	})
	$(".edit").click(function() {
		that.handler4Edit(this)
	})
	$("h6").click(function() {
		that.handler4H(this)
	})
	$(".checkData").click(function() {
		that.hanler4Data(this)
	})
}
CreateList.prototype.handler4Del=function(target) {
	//console.log($(target.parentNode).index())
	var ele=target.parentNode,
		index=$(ele).index(),
		that=this
		ele.remove()
		that.storage.del("*","title",[index])
		that.storage.del("*","html",[index])
}
CreateList.prototype.handler4DelMany=function() {
	var arr=[],
		that=this,
		ele=$("ul input")
	ele.each(function(index) {
		if(this.checked){
			arr.push(index)
		}
	})
	ele.each(function() {
		if(this.checked){
			this.parentNode.remove()
		}
	})

	that.storage.del("*","title",arr)
	that.storage.del("*","html",arr)
}
CreateList.prototype.handler4Select=function(target) {
	//console.log($("input[type=checkbox]").length)
	if(target.checked){
		$("input[type=checkbox]").each(function() {
			this.checked=true
		})
	}else{
		$("input[type=checkbox]").each(function() {
			this.checked=false
		})
	}
}
CreateList.prototype.handler4Edit=function(target) {
	var url=this.getURL(target,"submitform.html")
	window.location.href=url
}
CreateList.prototype.checkDate=function() {
	var arr=localStorage.title.split("*"),
		obj,deadline,arr1,date1,str
		date2=new Date(),
		eles=$(".state"),
		that=this,
		count=0

	for(var i=0;i<arr.length;i++){
		obj=JSON.parse(arr[i])
		deadline=obj.deadline
		arr1=deadline.split(",")
		date1=new Date(Number(arr1[0]),Number(arr1[1])-1,Number(arr1[2]))
		//console.log(date1<date2)
		if(date1<date2){
			$(eles[i]).html("已结束")
			//console.log(obj.state)
			$(eles[i]).removeClass(".publishState")
			str=arr[i].replace(obj.state,"已结束")
			this.storage.change("*","title",str,i)
			count++
		}
	}


	//console.log(count)

	setTimeout(function() {
		if(count===arr.length){
			return
		}
		that.checkDate()
	},1000)
}
CreateList.prototype.getURL=function(target,str0) {
	var index=$(target.parentNode).index(),
		str="?"+"index="+index,
		url=str0+str
	localStorage["judge"]=true;
	return url
}
CreateList.prototype.handler4H=function(target) {
	//console.log(this)
	var ele=$(target.parentNode).find(".state"),
		state=$(ele).html(),
		url=this.getURL(target,"submit.html")

	if(state!=="未发布"){
		window.open(url)
	}
}
CreateList.prototype.hanler4Data=function(target) {
	var url=this.getURL(target,"datashow.html")

	window.location.href=url
}