if(localStorage.title!==undefined){
	var list=new CreateList()
	list.init()
}
$(".newQ").click(function() {
	window.location.href="submitform.html"
})