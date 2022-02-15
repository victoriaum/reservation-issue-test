$(function(){
  func_studentBtn();
})


// student 클릭시
function func_studentBtn(){
  $("#teacherCheck").removeClass("clickedCheck");
  $("#studentCheck").addClass("clickedCheck");

  $(".dataArea").html("<table><thead><tr>"
                  + " <th scope='col'>학년</th>"
                  + " <th scope='col'>아이디</th>"
                  + " <th scope='col'>이름</th>"
                  + " </tr></thead></table>");
  func_getStudentAll();
}


// teacher 클릭시
function func_teacherBtn(){
  $("#studentCheck").removeClass("clickedCheck");
  $("#teacherCheck").addClass("clickedCheck");

  $(".dataArea").html("<table><thead><tr>"
                  + " <th scope='col'>진료과</th>"
                  + " <th scope='col'>아이디</th>"
                  + " <th scope='col'>이름</th>"
                  + " <th scope='col'>직위</th>"
                  + " </tr></thead></table>");
  func_getTeacherAll();
}


// student 목록 가져오기
function func_getStudentAll(){
  $.ajax({
    url:"/admin/getStudentAll",
    type: "post",
    dataType:"json",
    success: function(json) {
      $("table").append(json.html);
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}


// teacher 목록 가져오기
function func_getTeacherAll(){
  $.ajax({
    url:"/admin/getTeacherAll",
    type: "post",
    dataType:"json",
    success: function(json) {
      $("table").append(json.html);
    },
    error: function(report, status, error){
      alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
    }
  });
}