$(function(){
  var todayDate = new Date();
  var year = todayDate.getFullYear();
  var month = todayDate.getMonth()+1;
  var date = todayDate.getDate();

  // 초기값 설정
  func_inputYear(year);
  func_inputMonth(month);
  var weekcntArray = func_weekNow(year, month, date).split(" ");
  func_weekBtn(Number(weekcntArray[0]),Number(weekcntArray[1]));
  var dateArray = func_calculatePeriodDate(year, month, Number(weekcntArray[0]), Number(weekcntArray[1])).split(" ");
  func_getSchedule(dateArray[0], dateArray[1]);
});


// year 변경하는 경우
function func_yearChange() {
  $(".scheduleCnt").html("");
  $(".scheduleArea").html("");
  var year = Number($("#year option:selected").val());
  var month = Number($("#month option:selected").val());

  func_inputYear(year);
  var weekcntArray = func_weekNow(year, month, 1).split(" ");
  func_weekBtn(1,Number(weekcntArray[1]));
  var dateArray = func_calculatePeriodDate(year, month, 1, Number(weekcntArray[1])).split(" ");
  func_getSchedule(dateArray[0], dateArray[1]);
}


// month 변경하는 경우
function func_monthChange() {
  $(".scheduleCnt").html("");
  $(".scheduleArea").html("");
  var year = Number($("#year option:selected").val());
  var month = Number($("#month option:selected").val());

  var weekcntArray = func_weekNow(year, month, 1).split(" ");
  func_weekBtn(1,Number(weekcntArray[1]));
  var dateArray = func_calculatePeriodDate(year, month, 1, Number(weekcntArray[1])).split(" ");
  func_getSchedule(dateArray[0], dateArray[1]);
}


// week을 선택하는 경우
function func_weekChange(obj){
  $(".scheduleCnt").html("");
  $(".scheduleArea").html("");
  $(".weekNo").removeClass("checkedWeekNo");
  $(obj).addClass("checkedWeekNo");

  var year = Number($("#year option:selected").val());
  var month = Number($("#month option:selected").val());

  var checkedWeekNo = $(obj).text();
  var lastdate = new Date(year, month, 0).getDate();

  var date = 1+7*(checkedWeekNo-1);
  if(date>lastdate){
    date=lastdate;
  }

  var weekcntArray = func_weekNow(year, month, date).split(" ");
  var dateArray = func_calculatePeriodDate(year, month, checkedWeekNo, Number(weekcntArray[1])).split(" ");
  func_getSchedule(dateArray[0], dateArray[1]);
}


// 참석자 명단 이름 가져오기
function func_getNameList(attenders){
  $.ajax({
    url:"/getNameList",
    type: "post",
    dataType: "json",
    data:{attenders:attenders},
    success: function(data){
      $(".attenders").append("<br><span style='font-weight: normal'>"+data.nameList+"</span>");
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 참석자 명단보기
function func_detailSchedule(obj) {
  $(".downBtn").show();
  $(".upBtn").remove();
  $(".attenders").remove();
  $(".edit").remove();

  var attenders = String($(obj).next().val());
  var id = $(obj).next().next().val();
  var nameList = $("#nameList").val();

  if($("#loginType").val()=="1"){
    if(attenders==""){
      $(obj).after("<img class='smallImg detailBtn upBtn' src='image/schedule/up.png' onclick='func_closeSchedule(this)'/>"
          + "<div class='edit' onclick='func_detail("+id+")'>수정/삭제하기</div>");
    } else {
      $(obj).after("<img class='smallImg detailBtn upBtn' src='image/schedule/up.png' onclick='func_closeSchedule(this)'/>"
          + "<div class='attenders'>현재 신청자:</div>"
          + "<div class='edit' onclick='func_detail("+id+")'>수정/삭제하기</div>");
      func_getNameList(attenders);
    }
  } else {
    if(attenders==""){
      $(obj).after("<img class='smallImg detailBtn upBtn' src='image/schedule/up.png' onclick='func_closeSchedule(this)'/>"
          + "<div class='edit' onclick='func_requestCancel("+id+")'>취소하기</div>");
    } else {
      $(obj).after("<img class='smallImg detailBtn upBtn' src='image/schedule/up.png' onclick='func_closeSchedule(this)'/>"
          + "<div class='attenders'>현재 신청자:</div>"
          + "<div class='edit' onclick='func_requestCancel("+id+")'>취소하기</div>");
      func_getNameList(attenders);
    }
  }

  $(obj).hide();
}


// 일정 요청 취소하기
function func_requestCancel(id) {
  $.ajax({
    url:"/requestCancel",
    type: "post",
    dataType:"json",
    data:{schedule_no:id},
    success: function(json){
      if(json.result!=""){    // 일정 취소성공
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        setTimeout(function() {
          location.href="/schedule";
        }, 1300);
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 참석자 명단 가리기
function func_closeSchedule(obj) {
  $(obj).prev().show();
  $(".upBtn").remove();
  $(".attenders").remove();
  $(".edit").remove();
}



// 일정 편집페이지로 이동
function func_detail(id) {
  location.href="/report_t/makeSchedule?no="+id;
}


// year Input 설정
function func_inputYear(year){
  $("#year").html("");

  // Year Input, 현재 년도 기준으로 작년, 올해 보여줌.
  for(var i=year-1; i<year+2; i++){
    $("#year").append("<option value='"+i+"'>"+i+"</option>");
  }
  $("#year").val(year).prop("selected",true);
}


// month Input 설정
function func_inputMonth(month){
  $("#month").html("");

  // Month Input
  var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  for(var i=0; i<monthArray.length; i++){
    $("#month").append("<option value='"+(i+1)+"'>"+monthArray[i]+"</option>");
  }
  $("#month").val(month).prop("selected",true);
}


// 일자로 현재 주차 계산하기
function func_weekNow(year,month,date) {
  var lastdate = new Date(year, month, 0).getDate();
  var firstdateDay = new Date(year, month-1, 1).getDay();
  var lastdateDay = new Date(year, month-1, lastdate).getDay();
  var today = new Date(year, month-1, date).getDay();

  var weekcnt = Math.floor(lastdate / 7);
  if (firstdateDay % 7 != 0) {
    if (7 - firstdateDay < lastdate % 7) {
      weekcnt = weekcnt + 2;
    } else {
      weekcnt = weekcnt + 1;
    }
  }

  var weekcntToday = Math.floor(date / 7)+1;
  if (firstdateDay != 0) {
    if (7 - firstdateDay < date % 7) {
      weekcntToday = weekcntToday + 1;
    }
  }

  return weekcntToday + " " + weekcnt;
}


// weekBtn 만들기
function func_weekBtn(checkedWeekNo, weekcnt){
  $("#week").html("");
  for(var i=1; i<weekcnt+1; i++){
    if(i==checkedWeekNo){
      $("#week").append("<span class='col weekNo checkedWeekNo' value='"+i+"' onclick='func_weekChange(this)'>"+i+"</span>");
    } else {
      $("#week").append("<span class='col weekNo' value='"+i+"' onclick='func_weekChange(this)'>"+i+"</span>");
    }
  }
}


// 주차 시작일, 마지막날 계산하기
function func_calculatePeriodDate(year,month,checkedWeekNo, weekcnt){
  var lastdate = new Date(year, month, 0).getDate();
  var firstdateDay = new Date(year, month - 1, 1).getDay();
  var lastdateDay = new Date(year, month - 1, lastdate).getDay();

  var date = 1+7*(checkedWeekNo-1);
  if(date>lastdate){
    date=lastdate;
  }

  var today = new Date(year, month - 1, date).getDay();

  if(month<10){
    month="0"+month;
  }

  var weekStartDate, weekEndDate;

  if(checkedWeekNo==1){
    weekStartDate = year+"-"+month+"-01";
    weekEndDate = year+"-"+month+"-0"+(7-firstdateDay);

  } else if(weekcnt==checkedWeekNo){
    weekStartDate = year+"-"+month+"-"+(lastdate-lastdateDay);
    weekEndDate = year+"-"+month+"-"+lastdate;

  } else {
    if((date-today)<10){
      weekStartDate = year+"-"+month+"-0"+(date-today);
    }
    else {
      weekStartDate = year+"-"+month+"-"+(date-today);
    }

    if((date+7-today)<10){
      weekEndDate = year+"-"+month+"-0"+(date+6-today);
    }
    else {
      weekEndDate = year+"-"+month+"-"+(date+6-today);
    }
  }
  return weekStartDate+" "+weekEndDate;
}


// 일정 가져오기
function func_getSchedule(startDate, endDate){
  $.ajax({
    url:"/getSchedule",
    type: "post",
    dataType: "json",
    data:{startDate:startDate, endDate:endDate},
    success: function(data){
      var cnt = data.scheduleList.length;
      $("#scheduleCnt").html("총 "+cnt+"개의 일정");

      if(cnt>0) {    // 해당하는 일정이 있는 경우
        $.each(data.scheduleList, function (idx,val) {
          var scheduleArray = val.split(",");
          var dateArray = scheduleArray[1].split("-");
          var date = Number(dateArray[1])+"/"+dateArray[2];
          var length = scheduleArray.length;
          var attenderArray,attenderCnt;

          if($("#loginType").val()=="1"){
            for(var i=5; i<length; i++){
              if(i==5){
                attenderArray=scheduleArray[i];
              } else {
                attenderArray+=","+scheduleArray[i];
              }
            }
            attenderCnt = attenderArray.split(",").length;
            if(scheduleArray[5]==""){
              attenderCnt = 0;
            }

            $(".scheduleArea").append("<div class='scheduleDetail' id='"+scheduleArray[0]+"'>"
                                    + "<span class='date'>"+date+"&nbsp;&nbsp;</span>"
                                    + "<span class='time'>"+scheduleArray[2]+"&nbsp;-&nbsp;"+scheduleArray[3]+"</span>"
                                    + "<span>&nbsp;&nbsp;</span>"
                                    + "<img class='smallImg' src='image/report/attender.png'/>"
                                    + "<span> "+attenderCnt+"&nbsp;/&nbsp;</span>"
                                    + "<span class=''>"+scheduleArray[4]+"</span>"
                                    + "<img class='smallImg detailBtn downBtn' src='image/schedule/down.png' onclick='func_detailSchedule(this)'/>"
                                    + "<input type='hidden' value='"+attenderArray+"' />"
                                    + "<input type='hidden' value='"+scheduleArray[0]+"' /></div>");
          }
          else {
            for(var i=7; i<length; i++){
              if(i==7){
                attenderArray=scheduleArray[i];
              } else {
                attenderArray+=","+scheduleArray[i];
              }
            }
            attenderCnt = attenderArray.split(",").length;
            if(scheduleArray[7]==""){
              attenderCnt = 0;
            }

            $(".scheduleArea").append("<div class='scheduleDetail' id='"+scheduleArray[0]+"' >"
                                    + "<span class='date'>"+date+"&nbsp;&nbsp;&nbsp;&nbsp;</span>"
                                    + "<span class='time'>"+scheduleArray[2]+"&nbsp;-&nbsp;"+scheduleArray[3]+"</span><br>"
                                    + "<span>"+scheduleArray[4]+" </span>"
                                    + "<span>"+scheduleArray[5]+"&nbsp;"+scheduleArray[6]+"</span>"
                                    + "<img class='smallImg detailBtn downBtn' src='image/schedule/down.png' onclick='func_detailSchedule(this)'/>"
                                    + "<input type='hidden' value='"+attenderArray+"' />"
                                    + "<input type='hidden' value='"+scheduleArray[0]+"' /></div>");
          }
        });
      }
      else{    // 해당하는 일정이 없는 경우
        $("#scheduleCnt").html("일정이 없습니다.");
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}
