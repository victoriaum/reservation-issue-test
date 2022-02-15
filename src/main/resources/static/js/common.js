$(function(){
  var today = new Date();

  // 로그아웃 클릭시
  $("img#logoutBtn").click(function(){
    location.href="/login";
  });

  // 로그인한 아이디 가져오기
  $(".student_id").val("${session.loginUser.student_id}");

});