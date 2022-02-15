$(function(){
  var todayDate = new Date();
  var year = todayDate.getFullYear();
  var month = todayDate.getMonth()+1;
  var date = todayDate.getDate();

  if(month<10){
    month="0"+month;
  }
  if(date<10){
    date="0"+month;
  }

  func_getTodaySchedule(year+"-"+month+"-"+date);

  $(".moreNotice").click(function(){
    location.href="/notice";
  });
  $(".moreSchedule").click(function(){
    location.href="/schedule";
  });
});


// 오늘 일정 가져오기
function func_getTodaySchedule(todayDate){
  $.ajax({
    url:"/getTodaySchedule",
    type: "post",
    dataType: "json",
    data:{todayDate:todayDate},
    success: function(data){
      var cnt = data.scheduleList.length;

      if(cnt>0) {    // 해당하는 일정이 있는 경우
        $.each(data.scheduleList, function (idx,val) {
          var scheduleArray = val.split(",");
          var length = scheduleArray.length;

          if($("#loginType").val()=="1"){
            func_requestCntDelete();  // 요청인원 지우기

            for(var i=4; i<length; i++){
              if(i==4){
                attenderArray=scheduleArray[i];
              } else {
                attenderArray+=","+scheduleArray[i];
              }
            }
            attenderCnt = attenderArray.split(",").length;
            if(scheduleArray[4]==""){
              attenderCnt = 0;
            }

            $(".indexSchedule").append("<p class='indexContentsDetail detail2' value='"+scheduleArray[0]+"'> "
                + "<span class='indexContentsDetailInfo2'>"+scheduleArray[1]+"</span>"
                + "<span class='noticeSubject1'>검사요청 인원: "
                + "<span class='import'>"+attenderCnt+"</span>명</span></p>");
          }
          else {
            $(".indexSchedule").append("<p class='indexContentsDetail detail2' value='"+scheduleArray[0]+"'> "
                + "<span class='indexContentsDetailInfo2'>"+scheduleArray[1]+"</span>"
                + "<span class='noticeSubject1'>"
                + "<span>"+scheduleArray[2]+" "+scheduleArray[3]+" "+scheduleArray[4]+"</span></span></p>");
          }
        });
      }
      else{    // 해당하는 일정이 없는 경우
        if($("#loginType").val()=="1"){
          $(".indexSchedule").append("<p class='indexContentsDetail detail2'> "
              + "<span class='noticeSubject2'>오늘 일정은 없습니다.</span></p>");
          func_requestCnt();  // 교수님의 경우, 개설요청인원 표기하기
        }
        else {
          $(".indexSchedule").append("<p class='indexContentsDetail detail2'> "
              + "<span class='noticeSubject1'>오늘 일정은 없습니다.</span></p>");
        }
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 요청인원 찾기
function func_requestCnt(){
  $.ajax({
    url:"/index/requestCnt",
    type: "post",
    dataType: "json",
    success: function(data){
      $(".detail2").append("<span class='requesters'>현재 개설 요청인원은"
          + "<span class='requestCnt'>"+data.requestCnt+" 명</span> 입니다.</span></p>");
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 요청인원 지우기
function func_requestCntDelete(){
  $.ajax({
    url:"/index/requestCntDelete",
    type: "post",
    success: function(){
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}