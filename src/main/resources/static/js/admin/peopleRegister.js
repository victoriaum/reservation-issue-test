$(function(){
  func_studentBtn();
})



// student 클릭시
function func_studentBtn(){
  $("#teacherCheck").removeClass("clickedCheck");
  $("#studentCheck").addClass("clickedCheck");
  $(".inputArea").next().remove();
  $(".inputArea").html("");
  $("#error").html("");
  func_studentField();
}


// teacher 클릭시
function func_teacherBtn(){
  $("#studentCheck").removeClass("clickedCheck");
  $("#teacherCheck").addClass("clickedCheck");
  $(".inputArea").next().remove();
  $(".inputArea").html("");
  $("#error").html("");
  func_teacherField();
}


// student 필드 생성
function func_studentField(){
  $(".helpArea").html("<span>※ 학번은 아이디와 초기 비밀번호로 입력됩니다.</span>");
  $(".inputArea").html("<div><img class='space1 minusBtn' src='image/admin/minus.png' onclick='func_minusStudent(this)'/>"
              + " <select class='grade'><option selected>본1</option>"
              + " <option>본2</option>"
              + " <option>본3</option>"
              + " <option>본4</option></select>"
              + " <input type='number' class='space2 id' placeholder='학번' />"
              + " <input type='text' class='space3 name' placeholder='이름' /></div>");
  $(".inputArea").after("<div class='addBtn' onclick='func_addStudent(this)'>"
              + " <img class='/' src='image/admin/addPerson.png' /></div>");
  $("#button").html("<button type='button' class='btn btn-primary registerBtn' onclick='func_studentRegister()'>"
              + " 저장하기</button>");
}


// teacher 필드 생성
function func_teacherField(){
  $(".helpArea").html("<span>※ 아이디는 되도록 다음 예시를 준수해주세요"
      + "<br>ex) '조치대'인 경우, 'choicd'</span>");
  $(".inputArea").html(" <select class='dept'><option selected>교정과</option>"
      + " <option>내과</option>"
      + " <option>보철과</option>"
      + " <option>소아치과</option>"
      + " <option>외과</option>"
      + " <option>치주과</option></select>");
  $(".inputArea").append("<div><img class='space1 minusBtn' src='image/admin/minus.png' onclick='func_minusTeacher(this)'/>"
      + " <input type='text' class='space4 id' placeholder='아이디' />"
      + " <input type='text' class='space5 name' placeholder='성함' />"
      + " <select class='position'><option selected>교수님</option>"
      + " <option>선생님</option></select></div>");
  $(".inputArea").after("<div class='addBtn' onclick='func_addTeacher(this)'>"
      + " <img class='/' src='image/admin/addPerson.png' /></div>");
  $("#button").html("<button type='button' class='btn btn-primary registerBtn' onclick='func_teacherRegister()'>"
      + " 저장하기</button>");
}


// student 필드 입력줄 한 개 삭제
function func_minusStudent(obj){
  $(obj).parent().remove();
}

// teacher 필드 입력줄 한 개 삭제
function func_minusTeacher(obj){
  $(obj).parent().remove();
}


// student 필드 입력줄 한 개 추가
function func_addStudent(obj){
  $(".inputArea").append("<div><img class='space1 minusBtn' src='image/admin/minus.png' onclick='func_minusStudent(this)'/>"
      + " <select class='grade'><option selected>본1</option>"
      + " <option>본2</option>"
      + " <option>본3</option>"
      + " <option>본4</option></select>"
      + " <input type='number' class='space2 id' placeholder='학번' />"
      + " <input type='text' class='space3 name' placeholder='이름' /></div>");
}


// teacher 필드 입력줄 한 개 추가
function func_addTeacher(obj){
  $(".inputArea").append("<div><img class='space1 minusBtn' src='image/admin/minus.png' onclick='func_minusTeacher(this)'/>"
      + " <input type='text' class='space4 id' placeholder='아이디' />"
      + " <input type='text' class='space5 name' placeholder='성함' />"
      + " <select class='position'><option selected>교수님</option>"
      + " <option>선생님</option></select></div>");
}


// student 유효성검사 및 등록
function func_studentRegister(){
  var idAll = "";
  var nameAll = "";
  var gradeAll = "";
  var flag = true;

  $(".id").each(function() {
    var id = $(this).val();
    if(id==null || id==""){
      flag = false;
    } else {
      idAll += id+" ";
    }
  });

  $(".name").each(function() {
    var name = $(this).val();
    if(name==null || name==""){
      flag = false;
    } else {
      nameAll += name+" ";
    }
  });

  $(".grade").each(function() {
    var grade = $(this).val();
    gradeAll += grade+" ";
  });

  if(!flag){
    $("#error").html("빈칸이 없어야 저장이 가능합니다!");
  } else {
    $.ajax({
      url:"/admin/studentRegister",
      type: "post",
      dataType:"json",
      data:{idAll:idAll,nameAll:nameAll,gradeAll:gradeAll},
      success: function(json) {
        if (json.result == 1) {    // 학생 모두 등록 성공
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1200
          })
          setTimeout(function() {}, 1300);
        } else {    // 학생 일부/전체 등록 실패
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            html: json.result+'<br>위 학번을 가진 학생은 이미 있습니다. <br>수정후 다시 시도해주세요!'
          })
        }
      },
      error: function(report, status, error){
        alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
      }
    });
  }
}


// teacher 유효성검사 및 등록
function func_teacherRegister(){
  var idAll = "";
  var nameAll = "";
  var positionAll = "";
  var dept = $(".dept").val();
  var flag = true;

  $(".id").each(function() {
    var id = $(this).val();
    if(id==null || id==""){
      flag = false;
    } else {
      idAll += id+" ";
    }
  });

  $(".name").each(function() {
    var name = $(this).val();
    if(name==null || name==""){
      flag = false;
    } else {
      nameAll += name+" ";
    }
  });

  $(".position").each(function() {
    var poisition = $(this).val();
    positionAll += poisition+" ";
  });

  if(!flag){
    $("#error").html("빈칸이 없어야 저장이 가능합니다!");
  } else {
    $.ajax({
      url:"/admin/teacherRegister",
      type: "post",
      dataType:"json",
      data:{idAll:idAll,nameAll:nameAll,positionAll:positionAll,dept:dept},
      success: function(json) {
        if (json.result == 1) {    // 선생님 모두 등록 성공
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1200
          })
          setTimeout(function() {}, 1300);
        } else {    // 선생님 일부/전체 등록 실패
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            html: json.result+'<br>위 아이디가 이미 있습니다. <br>수정후 다시 시도해주세요!'
          })
        }
      },
      error: function(report, status, error){
        alert("code: "+report.status+"\n"+"message: "+report.responseText+"\n"+"error: "+error);
      }
    });
  }

}