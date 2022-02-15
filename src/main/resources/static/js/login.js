// 로그인 유효성 검사
function func_login(){

  var form = document.loginForm;
  var id = $("#id").val();
  var password = $("#password").val();

  if(id==null || id=="" || id=="아이디"){
    $("#id").focus();
    $("#error").html("아이디를 입력해 주세요.");
    return false;
  }

  if (password==null || password=="") {
    $("#password").focus();
    $("#error").html("비밀번호를를 입력해 주세요.");
    return false;
  }

  return true;
  form.submit();
}