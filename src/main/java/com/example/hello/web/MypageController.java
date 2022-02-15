package com.example.hello.web;

import com.example.hello.service.StudentService;
import com.example.hello.service.TeacherService;
import com.example.hello.web.dto.StudentDto;
import com.example.hello.web.dto.TeacherDto;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
public class MypageController {
  private final TeacherService teacherService;
  private final StudentService studentService;

  @RequestMapping("mypage")
  public String mypage() {
    return "mypage";
  }

  @RequestMapping("mypage/editAccount")
  public String editAccount() {
    return "editAccount";
  }

  @PostMapping("mypage/editPassword")
  public String login(@RequestParam("id") String id, @RequestParam("password") String password, @RequestParam("type") String type,
                      HttpServletRequest request, Model m) {

    HttpSession httpSession = request.getSession();

    if("1".equals(type)) {
      TeacherDto teacherDto = teacherService.editPassword(id,password);
      httpSession.setAttribute("loginUser",teacherDto);
    }
    else if("2".equals(type)) {
      StudentDto studentDto = studentService.editPassword(id,password);
      httpSession.setAttribute("loginUser",studentDto);
    }

    m.addAttribute("result","변경성공");
    return "editAccount";
  }

}