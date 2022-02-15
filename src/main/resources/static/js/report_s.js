$(function(){

  $(".firstArea").show();
  $(".secondArea").hide();
  $(".thirdArea").hide();

  // 과 선택했을 때
  $(".dept").click(function(){
    var checkedDept = $(this).text();

    $(".choosenArea").append("<span class='choice checkedChoice' id='checkedDept'>"
                              +checkedDept
                              +"<img class='closeCheckedChose' id='deptOut' "
                                  + "onclick='func_deptOut()' src='image/close_white.png'/>"
                              +"</span>")

    $(".firstArea").hide();
    $(".secondArea").show();

    $.ajax({
      url:"/report_s/getTeacher",
      type: "post",
      dataType:"json",
      data:{checkedDept:checkedDept},
      success: function(json){
        $.each(json.teacherList, function(idx, val) {
          var valArray = val.split(",");
          val = val.replace(","," ");
          $(".secondArea").append("<span class='choice teacher' id='"+valArray[0]+" "+valArray[1]+","+valArray[2]+","+valArray[3]+"' "
                                  + "onclick='func_getSchedule(this.id)'>"
                                  + valArray[0]+" "+valArray[1]+"</span>")
        });
      },
      error: function(report, status, error){
        alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
      }
    });
  });

});


// 선생님 선택했을 때
// id값 ex) "teacher_name teacher_position,teacher_id,request_students"
function func_getSchedule(id){
  var idArray = id.split(",");
  var teacher_id = idArray[1];
  var student_id = $("#loginId").val();
  var checked = "";

  var studentsArray;
  for(var i=2; i<idArray.length; i++){
    if(i==2){
      studentsArray=idArray[i];
    } else {
      studentsArray+=","+idArray[i];
    }

    if(student_id==idArray[i]){
      checked = "checked";
    }
  }


  $(".choosenArea").append("<span class='choice checkedChoice' id='checkedTeacher'>"
                            +idArray[0]
                            +"<img class='closeCheckedChose' id='teacherOut' "
      + "                           onclick='func_teacherOut()' src='image/close_white.png'/>"
                            +"</span>")

  $(".secondArea").hide();
  $(".thirdArea").show();

  $.ajax({
    url:"/report_s/getTeacherSchedule",
    type: "post",
    data:{checkedTeacher:teacher_id},
    success: function(data){

      if(data.length>0) {    // 저장된 일정이 있는 경우
        $.each(data, function (idx,val) {
          var attenderCnt;
          if(val.schedule_attender==""){
            attenderCnt = 0;
          } else {
            attenderCnt = val.schedule_attender.split(",").length;
          }

          $(".thirdArea").append(
              "<div class='subArea' id='" +val.schedule_no+ "' onclick='func_report(this)'>"
              + "<span class='date'>" + val.schedule_date + "</span><br>"
              + "<span class='time'>" + val.schedule_start + " - "
              + val.schedule_end + "</span><br>"
              + "<span class='space'><span id='attenderCnt'>" + attenderCnt
              + "</span> / " + val.schedule_space + "</span>"
              + "<img class='attenderImg' src='image/report/attender.png'/>"
              + "</div>");
        });
      }
      else{    // 저장된 일정이 없는 경우
        console.log(checked);
        if(checked==""){   //개설 요청을 안한 경우
          $(".thirdArea").html("<div class='noSchedule'>정해진 일정이 없습니다.<br>일정 개설을 요청하시겠습니까?"
              + "<button class='btn noScheduleBtn openRequest' id='"+teacher_id+"' onclick='func_openRequest(this.id)'>일정 개설 요청하기</button></div>");
        }
        else {    //개설 요청을 한 경우
          $(".thirdArea").html("<div class='noSchedule'>일정 개설이 요청됐습니다.<br>요청 취소를 원하시면 아래 취소 버튼을 눌러주세요."
              + "<button class='btn noScheduleBtn revokeOpenRequest' id='"+teacher_id+"' onclick='func_revokeOpenRequest(this.id)'>일정 개설 취소하기</button></div>");
        }
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}



// 선택한 진료과 지우기
function func_deptOut(){
  $("#checkedDept").remove();
  $("#checkedTeacher").remove();

  $(".firstArea").show();
  $(".secondArea").hide();
  $(".thirdArea").hide();

  $(".secondArea").html("");
  $(".thirdArea").html("");
}


// 선택한 선생님 지우기
function func_teacherOut(){
  $("#checkedTeacher").remove();

  $(".secondArea").show();
  $(".firstArea").hide();
  $(".thirdArea").hide();

  $(".thirdArea").html("");
}


// 검사요청하기
function func_report(subArea) {
  var id = subArea.id;

  if($(subArea).hasClass("smallWidth")){
    $(subArea).removeClass("smallWidth");
    $(subArea).next().remove();
  } else {
    $(subArea).addClass("smallWidth");
    $(subArea).after("<div class='reportBtnSpace'>"
                  + "<span type='button' class='reportBtn reportOkay' id='"+id+"' onclick='func_reportOkay(this)'>"
                  + "<img class='reportBtnImg' src='image/check_white.png'/>"
                  + "</span>"
                  + "<span type='button' class='reportBtn reportNo' id='"+id+"' onclick='func_reportNo(this)'>"
                  + "<img class='reportBtnImg' src='image/close_white.png'/>"
                  + "</span></div>");
  }
}


// 검사요청 okay 버튼 클릭시, 등록요청
function func_reportOkay(obj) {
  var login_id = $("#loginId").val();
  var schedule_no = Number(obj.id);

  $.ajax({
    url:"/report_s/requestReport",
    type: "post",
    dataType:"json",
    data:{schedule_no:schedule_no, login_id:login_id},
    success: function(json){
      if(json.result==1){    // 일정 저장성공
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        setTimeout(function() {
          location.href="/report_s";
        }, 1300);
        var attenderCnt = $(obj).parent().prev().children('span.space').children('span#attenderCnt');
        var cnt = Number(attenderCnt.text());
        attenderCnt.html(cnt+1);
      }
      else if(json.result==0){    // 일정 저장실패
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          showConfirmButton: false,
          timer: 1200
        })
        setTimeout(function() {
          location.href="/report_s";
        }, 1300);
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 검사요청 close 버튼 클릭시, 등록취소
function func_reportNo(obj) {
  var login_id = $("#loginId").val();
  var schedule_no = Number(obj.id);

  $.ajax({
    url:"/report_s/cancelReport",
    type: "post",
    dataType:"json",
    data:{schedule_no:schedule_no, login_id:login_id},
    success: function(json){
      if(json.result==1){    // 일정 취소성공
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        var attenderCnt = $(obj).parent().prev().children('span.space').children('span#attenderCnt');
        var cnt = Number(attenderCnt.text());
        attenderCnt.html(cnt-1);
      }
      else if(json.result==0){    // 일정 취소실패
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          html: '등록되지 않은 예약으로 취소할 수 없습니다!'
        })
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}



// 일정 개설 요청하기
function func_openRequest(id){
  $.ajax({
    url:"/report_s/openRequest",
    type: "post",
    data: {"teacher_id":id},
    dataType:"json",
    success: function(json){
      if(json.result==1){    // 요청성공
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        setTimeout(function() {
          $(".thirdArea").html("<div class='noSchedule'>일정 개설이 요청됐습니다.<br>요청 취소를 원하시면 아래 취소 버튼을 눌러주세요."
              + "<button class='btn noScheduleBtn revokeOpenRequest' id='"+id+"' onclick='func_revokeOpenRequest(this.id)'>일정 개설 취소하기</button></div>");
        }, 1300);
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// 일정 개설 요청취소하기
function func_revokeOpenRequest(id){
  $.ajax({
    url:"/report_s/revokeOpenRequest",
    type: "post",
    data: {"teacher_id":id},
    dataType:"json",
    success: function(json){
      if(json.result==1){    // 요청 취소성공
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1200
        })
        setTimeout(function() {
          $(".thirdArea").html("<div class='noSchedule'>정해진 일정이 없습니다.<br>일정 개설을 요청하시겠습니까?"
              + "<button class='btn noScheduleBtn openRequest' id='"+id+"' onclick='func_openRequest(this.id)'>일정 개설 요청하기</button></div>");
        }, 1300);
      }
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


