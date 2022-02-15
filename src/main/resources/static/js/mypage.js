$(function(){
  if($("#result").val()!=null && $("#result").val()!=""){
    Swal.fire({
      title: 'Success!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1200
    })
  }

  $(".editAccount").click(function(){
    location.href="/mypage/editAccount";
  });
});

// 비밀번호 변경
function func_editPassword(){
  var form = document.editPasswordForm;
  var id = $("#id").val();
  var password = $("#password").val();

  if (password==null || password=="") {
    $("#password").focus();
    $("#error").html("비밀번호를를 입력해 주세요.");
    return false;
  }

  return true;
  form.submit();
}