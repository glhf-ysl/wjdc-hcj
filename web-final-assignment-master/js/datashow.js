function ShowData() {}

ShowData.prototype.init=function() {
	var obj=new createPage()

	obj.init(".qContainer")
	this.renderUI()
	this.bindUI()
}
ShowData.prototype.renderUI=function() {
	var arr=window.location.href.split("="),
		index=arr[1],
		brr=localStorage.title.split("*"),
		obj=JSON.parse(brr[index]),
		q=obj.q,
		eles=$(".question"),
		str,
		obj0=new Storage(),
		index_=obj0.check("*","data",obj.title),
		obj1,
		eles0,total,eles1,num,ele,l,
		str3,ele0,eles2,eles3,deg,ele1,ele2,aDeg=[0],
		crr=["green","silver","orange","grey","pink","red"],
		sum=0,
		eleC,eleCi,
		a,nrr=[],
		qL,
		str1_="<div class='data'><h5>数据占比</h5>",
		str2_="<div class='total'><div class='part'></div></div><span class='numD'>0%</span>",
		drr,result

	if(index_!==-1){
		obj1=JSON.parse(localStorage.data.split("*")[index_])
		console.log(obj1)
	}

	$("h1").html(obj.title)
	$("input").remove()
	$("textarea").remove()

	for(var i=0;i<eles.length;i++){
		$(eles[i]).wrap("<div class='question_'></div>")
	}

	eles=$(".question_")

	for(var i=0;i<q.length;i++){
		qL=q[i].q_opt.length
		ele=$(eles[i])
		str=ele.html()
		switch (q[i].type) {
			case "radio":
				str+=str1_
				for(var j=0;j<qL;j++){
					str+=str2_
				}
				str+="</div>"
				break
			case "checkbox":
				str+=str1_+"<div class='cContainer_'>"
				for(var j=0;j<qL;j++){
					str+="<div class='cContainer'>"
						+"<div class='circle'></div>"
						+"</div>"
				}
				str+="</div></div>"
				break
			case "text":
				str+="<div class='data'><h5>有效数据占比</h5>"
					+str2_
					+"</div>"
				break
		}
		ele.html(str)

		eleC=$(".cContainer")
		eleCi=$(".circle")
		for(var n=0;n<eleC.length;n++){
			$(eleC[n]).addClass("cContainer"+n)
			$(eleCi[n]).addClass("circle"+n)
		}

		eles0=ele.find(".part")
		eles1=ele.find(".numD")
		eles2=ele.find(".cContainer")
		eles3=ele.find(".circle")
		total=0
		if(index_!==-1){
			l=obj1.q[i].opt.length
			drr=obj1.q[i].opt
			
			for(var m=0;m<l;m++){
				total+=drr[m]
			}
			
			if(total===0){
				continue
			}
			
			switch (q[i].type) {
				case "radio":
					for(var j=0;j<l;j++){
						num=(drr[j]/total)
						this.handler4Text(eles0[j],eles1[j],num)
					}
					break
				case "checkbox":
					//console.log(l)
					ele0=ele.find(".data")[0]
					str3=$(ele0).html()

					for(var j=0;j<l;j++){
						num=(drr[j]/total)
						if(num!==0&&num!==1){
							nrr.push(num)
						}
					}

					if(nrr.length===0){
						continue
					}
					console.log(nrr.sort())
					nrr=nrr.sort()
					result=this.check(nrr)
					
					$(eles2[0]).addClass("circle200")

					$(eles3[0]).css({
						backgroundColor: crr[0]
					})

					for(var j=0;j<nrr.length-1;j++){
						num=nrr[j]
						console.log(num)
						sum+=aDeg[j]
						num=(num>=0.5?(1-num):num)
						deg=num*360
						a=deg+sum
						
						if(result===1){
							$(eles2[j+1]).addClass("circle100")
						}
						if(result===2) {
							if(j===0){
								$(eles2[j+1]).addClass("circle200")
							}else{
								$(eles2[j+1]).addClass("circle100")
							}
						}
						if(result===3){
							if(a<=180){
								$(eles2[j+1]).addClass("circle200")
							}else{
								$(eles2[j+1]).addClass("circle100")
							}
						}

						$(eles2[j+1]).addClass("margin100")

						$(eles2[j+1]).css({
							transform: "rotate("+a+"deg)"
						})
						$(eles3[j+1]).css({
							backgroundColor: crr[j+1]
						})

						if(j+1===nrr.length-1){
							$(eles3[j+1]).css({
								backgroundColor: "black"
							})
						}

						aDeg.push(deg)
					}
					
					break
				case "text":
					num=(drr[0]/drr[1])
					this.handler4Text(eles0[0],eles1[0],num)
					break
			}
		}
	}
}
ShowData.prototype.handler4Text=function(ele1,ele2,num) {
	$(ele1).css("width",num*200+"px")
	$(ele2).html((num*100).toFixed(2)+"%")
}
ShowData.prototype.bindUI=function() {
	$(".back").click(function() {
		window.location.href="index.html"
	})
}
ShowData.prototype.check=function(nrr) {
	var result=2,
		l=nrr.length,
		count=0,
		count1=0,count2

	for(var i=0;i<l;i++){
		if(nrr[i]<0.25){
			count++
		}
		if(nrr[i]>0.25){
			count1++
		}
	}
	if(count===l){
		result=1
	}
	if(count1===3&&count===0){
		result=2
	}
	if(count1===2&&count!==0){
		result=3
	}
	if(count1===3&&count!==0){
		result=3
	}
	return result
}

var obj=new ShowData()
obj.init()