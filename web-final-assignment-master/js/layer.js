//浮层组件
var Layer=function(obj) {
	this.title="这是一个浮层" //可变
	this.content="这是一个浮层" //可变
	//this.handler4ConfirmBtn=null
}
Layer.prototype.show=function(obj) {
	var div1=document.createElement("div"),
		div2=document.createElement("div"),
		div3=document.createElement("div"),
		btn1=document.createElement("button"),
		btn2=document.createElement("button"),
		div4=document.createElement("div")

	div1.className="layer"
	div2.className="layerTitle"
	div2.innerHTML=obj.title||this.title
	div3.className="layerContent"
	div3.innerHTML= obj.content||this.content
	btn1.className="layerBtn1"
	btn1.innerHTML="确定"
	btn2.className="layerBtn2"
	btn2.innerHTML="取消"
	div1.appendChild(div2)
	div1.appendChild(div3)
	div1.appendChild(btn1)
	div1.appendChild(btn2)
	document.body.appendChild(div1)
	div4.className="mask"
	document.body.appendChild(div4)

	div4.onclick=this.hide
	btn1.onclick=obj.handler4ConfirmBtn
	btn2.onclick=obj.handler4CancelBtn
}
Layer.prototype.hide=function() {
	var layer=document.querySelector(".layer"),
		mask=document.querySelector(".mask")
	layer.remove()
	mask.remove()
}

//测试代码
// var obj=new Layer()
// obj.show()