$(function(){
  if($("#result").val()!=null && $("#result").val()!=""){
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1200
    })
    setTimeout(function() {
      location.href="/report_t";
    }, 1300);

  }
});

// 일정을 클릭했을 때
function func_edit(obj, id){
  if($(obj).next().hasClass("editImg")){
    $(obj).next().remove();
    $(obj).removeClass("smallWidth");
  }
  else {
    $(obj).after("<img class='editImg' id='"+id+"' src='image/report/edit.png' "
        + "onclick='func_showSchedule("+id+")'/>");
    $(obj).addClass("smallWidth");
  }
}

// 일정 수정할 수 있는 makeScedule로 이동
function func_showSchedule(id){
  location.href="/report_t/makeSchedule?no="+id;
}


// 일정 저장하기
function func_saveSchedule(){

  var form = document.saveScheduleForm;
  var date = $("#date").val();
  var startTime = $("#startTime").val();
  var endTime = $("#endTime").val();
  var space = $("#space").val();

  if(date==null || date==""){
    $("#date").focus();
    $(".error").html("날짜를 입력해 주세요.");
    return false;
  }

  if(startTime==null || startTime==""){
    $("#startTime").focus();
    $(".error").html("시작시간을 입력해 주세요.");
    return false;
  }

  if(endTime==null || endTime==""){
    $("#endTime").focus();
    $(".error").html("마감시간을 입력해 주세요.");
    return false;
  }

  if(space==null || space==""){
    $("#space").focus();
    $(".error").html("가능인원을 입력해 주세요.");
    return false;
  }

  if(startTime>=endTime) {
    $("#endTime").focus();
    $(".error").html("마감시간이 시작시간보다 빠를 수 없습니다.");
    return false;
  }

  return true;
  form.submit();
}


// 일정 수정하기
function func_editSchedule(){
  const url = new URL(window.location.href);
  const no = url.searchParams.get('no');
  $("#no").val(no);

  var form = document.editScheduleForm;
  var date = $("#date2").val();
  var startTime = $("#startTime2").val();
  var endTime = $("#endTime2").val();
  var space = $("#space2").val();

  if(date==null || date==""){
    $("#date2").focus();
    $(".error").html("날짜를 입력해 주세요.");
    return false;
  }

  if(startTime==null || startTime==""){
    $("#startTime2").focus();
    $(".error").html("시작시간을 입력해 주세요.");
    return false;
  }

  if(endTime==null || endTime==""){
    $("#endTime2").focus();
    $(".error").html("마감시간을 입력해 주세요.");
    return false;
  }

  if(space==null || space==""){
    $("#space2").focus();
    $(".error").html("가능인원을 입력해 주세요.");
    return false;
  }

  if(startTime>=endTime) {
    $("#endTime2").focus();
    $(".error").html("마감시간이 시작시간보다 빠를 수 없습니다.");
    return false;
  }

  return true;
  form.submit();
}


// 일정 삭제하기
function func_deleteSchedule(){
  const url = new URL(window.location.href);
  const no = url.searchParams.get('no');

  $.ajax({
    url:"/report_t/deleteSchedule",
    type: "post",
    data:{no:no},
    success: function(data){
      Swal.fire({
        title: 'Success!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1200
      })
      setTimeout(function() {
        location.href="/report_t";
      }, 1300);
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}
