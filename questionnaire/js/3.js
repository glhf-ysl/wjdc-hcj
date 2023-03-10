$(".addQuestionBtn").click(function() {
	var questionnaire=new AddQuestion(),
		question=new CreateQuestion() //好像有了一点点赶脚
	var container=$(".container_")[0],
		calendar=new Calendar({
			mode:"single",
			minRange:3,
			maxRange:7,
			container:container,
			handler4SingleDay:function() {
				var date1=new Date(),
					date2=calendar.getSelectedDate()

				if(date1>date2){
					alert("问卷截止日期不能早于当前日期，请重新选择")
				}
			}
		})
	questionnaire.init()
	question.init()
	calendar.init()
})
if(/\?/.test(window.location.href)){
	$(".addQuestionBtn").trigger("click")
}