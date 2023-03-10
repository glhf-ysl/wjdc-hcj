var Calendar=function(params) {
	var defaults={
		state:true,
		mode:params.mode,
		minRange:params.minRange,
		maxRange:params.maxRange,
		container:params.container||document.body,
		handler4SingleDay:params.handler4SingleDay||null
	}
	this.cfg=$.extend({},defaults,params)
}
	
Calendar.prototype.init=function() {
	var input=document.createElement("input"),
		btn=document.createElement("button"),
		that=this,
		calWrap=document.createElement("div")

	calWrap.className="calWrap"
	input.className="dateInput"
	btn.innerHTML="日历开关"
	calWrap.appendChild(input)
	calWrap.appendChild(btn)
	this.cfg.container.appendChild(calWrap)

	btn.onclick=function() {
		$(".calContainer").toggle()
	}

	var container=document.createElement("div"),
		div=document.createElement("div"),
		leftArrow=document.createElement("div"),
		rightArrow=document.createElement("div"),
		inputYear=document.createElement("input"),
		inputMonth=document.createElement("input"),
		date=new Date(),
		year=date.getFullYear(),
		month=date.getMonth()
	
	container.className="calContainer"
	div.className="calHead"
	leftArrow.className="leftArrow"
	rightArrow.className="rightArrow"
	inputYear.className="inputYear"
	inputMonth.className="inputMonth"
	
	inputYear.value=year
	inputMonth.value=month+1
	
	div.appendChild(leftArrow)
	div.appendChild(rightArrow)
	div.appendChild(inputYear)
	div.appendChild(inputMonth)
	container.appendChild(div)

	var table=document.createElement("table")

	table.className="cal"
	container.appendChild(table)
	this.cfg.container.appendChild(container)

	this.fill(year,month)
	this.selectMode()

	inputYear.onblur=function() { //这段放在里外都行
		var _year=Number(inputYear.value),
			_month=Number(inputMonth.value)
		that.fill(_year,_month-1)
		that.selectMode()
	}
	inputMonth.onblur=function() {
		var _year=Number(inputYear.value),
			_month=Number(inputMonth.value)
		that.fill(_year,_month-1)
		that.selectMode()
	}

	leftArrow.onclick=function() {
		var _year=Number(inputYear.value),
			_month=Number(inputMonth.value)

		if(_month>1){
			inputMonth.value=_month-1
			that.fill(_year,_month-2)
		} else {
			inputYear.value=_year-1
			inputMonth.value=12
			that.fill(_year-1,11)
		}
		that.selectMode()
	}
	rightArrow.onclick=function() {
		var _year=Number(inputYear.value),
			_month=Number(inputMonth.value)

		if(_month<12){
			inputMonth.value=_month+1
			that.fill(_year,_month)
		} else {
			inputYear.value=_year+1
			inputMonth.value=1
			that.fill(_year+1,0)
		}
		that.selectMode()
	}

	container.style.display = "none"

	if(this.cfg.mode==="range"){
		var btn1=document.createElement("button"),
			btn2=document.createElement("button")

		btn1.innerHTML="确定"
		btn2.innerHTML="取消"

		container.appendChild(btn1)
		container.appendChild(btn2)
	}
}	
Calendar.prototype.fill=function(year,month) {
	var table=document.querySelector(".cal"),
		that=this

	table.innerHTML=""
	
	var str="",
		arr=["日","一","二","三","四","五","六"],
		tr=document.createElement("tr")
	for(var i=0;i<7;i++){
		str += "<td>"+arr[i]+"</td>"
	}
	tr.innerHTML=str
	table.appendChild(tr)

	var date=new Date(year,month,1),
		day=date.getDay(),
		curDays=new Date(year,month+1,0).getDate(), //获取当月天数
		prevDays=new Date(year,month,0).getDate() //获取前一月天数
		arr=[],
		brr=[[],[],[],[],[],[]]

	for(var i=0;i<day;i++){
		arr.push(prevDays+1-day)
		prevDays++
	}
	for(var i=1;i<=curDays;i++){
		arr.push(i)
	}
	var l=arr.length
	for(var i=1;i<=42-l;i++){
		arr.push(i)
	}
	for(var i=0;i<6;i++){
		for(var j=0;j<7;j++){
			brr[i].push(arr[0])
			arr.splice(0,1)
		}
	}

	for(var i=0;i<6;i++){
		var str=""
		var tr=document.createElement("tr")
		for(var j=0;j<7;j++){
			if(j!==0&&j!==6){
				str += "<td>"+brr[i][j]+"</td>"
			} else {
				str += "<td>"+brr[i][j]+"</td>"
			}
		}
		tr.innerHTML=str
		table.appendChild(tr)
	}

	var tds=table.querySelectorAll("td"),
		trs=table.querySelectorAll("tr")
	
	for(var i=0;i<7;i++){
		for(var j=0;j<7;j++){
			if(j==0||j==6){
				trs[i].childNodes[j].className="sCol"
			} 
		}
	}
	for(var i=7;i<day+7;i++){
		tds[i].className += " notCur"
	}
	for(var i=48;i>l+6;i--){
		tds[i].className += " notCur"
	}
}
Calendar.prototype.selectMode=function() {
	if(this.cfg.mode==="single"){
		this.selectSingleDay()
	} else {
		this.selectRange()
	}
}
Calendar.prototype.selectSingleDay=function() {
	this.cfg.mode="single"
	var table=document.querySelector(".cal"),
		that=this,
		tds=table.querySelectorAll("td")

	for(var i=7;i<49;i++){
		tds[i].onclick=function(event) {
			var active=document.querySelector(".active")
			if(active!==null){
				var str=active.className,
					str=str.slice(0, -7)
				active.className=str
			}
			var target=event.target
			target.className += " active"

			var date=that.getSelectedDate(),
				year_=date.getFullYear(),
				month_=date.getMonth(),
				day_=date.getDate(),
				str=year_+","+(month_+1)+","+day_,
				dateInput=document.querySelector(".dateInput"),
				container=document.querySelector(".calContainer")

			dateInput.value=str	
			container.style.display="none"
			that.state=!that.state
			
			that.cfg.handler4SingleDay&&that.cfg.handler4SingleDay()
		}
	}
}
Calendar.prototype.selectRange=function() {
	this.cfg.mode="range"
	var table=document.querySelector(".cal"),
		that=this,
		tds=table.querySelectorAll("td"),
		arr=[]

	for(var i=7;i<49;i++){
		tds[i].onclick=function(event) {
			var target=event.target
			target.className += " active"

			var str1=target.innerHTML,
				str2=target.className,
				index

			index=that.getIndex(str1,str2)

			arr.push(index)
			
			if(arr.length>=2){
				var num1=arr[0],
					num2=arr[1]

				if(num1<num2){
					if(num2-1-num1<that.minRange){
						that.some(num2,num1,that.minRange)
					}
					if(num2-1-num1>=that.minRange&&num2-1-num1<=that.maxRange){
						for(var i=num1+1;i<num2;i++){
							tds[i].style.backgroundColor="pink"
						}
					}
					if(num2-1-num1>that.maxRange){
						that.some(num2,num1,that.maxRange)
					}
				}
				if(num1>num2){
					if(num1-1-num2<that.minRange){
						that.some1(num1,num2,that.minRange)
					}
					if(num1-1-num2>=that.minRange&&num1-1-num2<=that.maxRange){
						for(var i=num2+1;i<num1;i++){
							tds[i].style.backgroundColor="pink"
						}
					}
					if(num1-1-num2>that.maxRange){
						that.some1(num1,num2,that.maxRange)
					}
				}
			}
		}
	}
}
Calendar.prototype.some=function(big,little,range) {
	var table=document.querySelector(".cal"),
		that=this,
		tds=table.querySelectorAll("td")

	var str=tds[big].className,
		brr=str.split(" "),
		str1=""
	for(var i=0;i<brr.length;i++){
		if(brr[i].search("active")!==-1){
			brr.splice(i,1)
		}
	}
	for(var i=0;i<brr.length;i++){
		str1 += brr[i]+" "
	}
	tds[big].className=str1

	tds[little+1+range].className += " active"
	for(var i=little+1;i<little+1+range;i++){
		tds[i].style.backgroundColor="pink"
	}
}
Calendar.prototype.some1=function(big,little,range) {
	var table=document.querySelector(".cal"),
		that=this,
		tds=table.querySelectorAll("td")

	var str=tds[little].className,
		brr=str.split(" "),
		str1=""
	for(var i=0;i<brr.length;i++){
		if(brr[i].search("active")!==-1){
			brr.splice(i,1)
		}
	}
	for(var i=0;i<brr.length;i++){
		str1 += brr[i]+" "
	}
	tds[little].className=str1

	tds[big-1-range].className += " active"
	for(var i=big-range;i<big;i++){
		tds[i].style.backgroundColor="pink"
	}
}
Calendar.prototype.selectDate=function(year,month,day) {
	var table=document.querySelector(".cal"),
		tds=table.querySelectorAll("td"),
		_year=Number(document.querySelector(".inputYear").value),
		_month=Number(document.querySelector(".inputMonth").value)

	if((year<_year&&month>_month)||(year===_year&&month<_month)){
		for(var i=7;i<21;i++){
			if(Number(tds[i].innerHTML)===day){
				tds[i].className += " active"
			}
		}
	}
	if(year===_year&&month===_month){
		for(var i=7;i<49;i++){
			if(Number(tds[i].innerHTML)===day&&tds[i].className.search("notCur")===-1){
				tds[i].className += " active"
			}
		}
	}
	if((year===_year&&month>_month)||(year>_year&&month<_month)){
		for(var i=35;i<49;i++){
			if(Number(tds[i].innerHTML)===day&&tds[i].className.search("notCur")!==-1){
				tds[i].className += " active"
			}
		}
	}
}
Calendar.prototype.getSelectedDate=function() {
	var year=Number(document.querySelector(".inputYear").value),
		month=Number(document.querySelector(".inputMonth").value),
		selectedDate=document.querySelector(".active"),
		day=Number(selectedDate.innerHTML),
		str=selectedDate.className

	if((day>=18&&str.search("notCur")!==-1)&&month===1){
		var date=new Date(year-1,11,day)
	}
	if((day>=18&&str.search("notCur")!==-1)&&month!==1){
		var date=new Date(year,month-2,day)
	}
	if((str.search("notCur")===-1)&&month!==1){
		var date=new Date(year,month-1,day)
	}
	if((day<=14&&str.search("notCur")!==-1)&&month!==12){
		var date=new Date(year,month,day)
	}
	if((day<=14&&str.search("notCur")!==-1)&&month===12){
		var date=new Date(year+1,0,day)
	}
	return date
}
Calendar.prototype.getIndex=function(str1,str2) {
	var table=document.querySelector(".cal"),
		tds=table.querySelectorAll("td"),
		index

	for(var i=7;i<49;i++){
		if(tds[i].innerHTML===str1&&tds[i].className===str2){
			index=i
			break
		}
	}
	return index
}

//测试代码
// var obj=new Calendar("range",3,7)
// obj.init()
//obj.selectDate(2017,8,27)
//obj.getSelectedDate()