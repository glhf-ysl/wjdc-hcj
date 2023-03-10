function createPage(){}

createPage.prototype.init=function(className) {
	this.renderUI(className)
}
createPage.prototype.renderUI=function(className) {
	var brr=window.location.href.split("="),
		index=brr[1],
		arr=localStorage.title.split("*"),
		obj=JSON.parse(arr[index]),
		str="<ul>",
		q=obj.q

	//console.log(obj)

	$("h2").html(obj.title)
	for(var i=0;i<q.length;i++){
		str+="<li class='question'>"
			+"<div class='qContent'><span class='num q_content'>"+q[i].num+"</span>"
			+"<span class='q_content'>"+q[i].q_content+"</span>"
		switch (q[i].type) {
			case "radio":
				str+="</div><ul><form>"
				for(var j=0;j<q[i].q_opt.length;j++){
					str+="<li>"+"<input type='radio' name='name' class='type'>"
						+"<span class='q_content'>"+q[i].q_opt[j]+"</span></li>"
				}
				str+="</form></ul></li>"
				break
			case "checkbox":
				str+="</div><ul><form>" //单选之谜。。。
				for(var j=0;j<q[i].q_opt.length;j++){
					str+="<li>"+"<input type='checkbox' name='name' class='type'>"
						+"<span class='q_content'>"+q[i].q_opt[j]+"</span></li>"
				}
				str+="<form></ul></li>"
				break
			case "text":
				if(q[i].required===true){
					str+="<span class='required'>(*此题必填)</span>"
				}
				str+="</div><textarea></textarea></li>"
				break
		}
	}

	str+="</ul>"
	//console.log(str)
	$(className).html(str)
}