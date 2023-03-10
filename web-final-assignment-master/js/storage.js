function Storage(){}

Storage.prototype.add=function(splitSymbol,key,value) {
	var str=localStorage[key]
	if(!str){
		str=""
		str+=value+splitSymbol
		str=str.slice(0, -1)
	}else{
		str+=splitSymbol+value
	}
	localStorage[key]=str
}
Storage.prototype.del=function(splitSymbol,key,brr) {
	var arr=localStorage[key].split(splitSymbol),
		str=""

	for(var j=0;j<brr.length;j++){
		for(var i=0;i<arr.length;i++){
			if(i===brr[j]){
				arr[i]=""
			}
		}
	}
	for(var i=0;i<arr.length;i++){
		if(arr[i]!==""){
			str+=arr[i]+splitSymbol
		}
	}
	
	if(str!==""){
		str=str.slice(0, -1)
	}

	localStorage.removeItem(key)
	if(str!==""){
		localStorage[key]=str
	}
}
Storage.prototype.check=function(splitSymbol,key,value) {
	//var title=$(".questionnaireTitle").val()
	if(localStorage[key]){
		var arr=localStorage[key].split(splitSymbol),
			l=arr.length
		for(var i=0;i<l;i++){
			var obj=JSON.parse(arr[i])
			if(obj[key]===value){
				return i
			}
		}
	}
	return -1
}
Storage.prototype.change=function(splitSymbol,key,value,index) {
	var arr=localStorage[key].split(splitSymbol),
		l=arr.length,
		str
	str=localStorage[key].replace(arr[index],value)
	localStorage.removeItem(key)
	localStorage[key]=str
}