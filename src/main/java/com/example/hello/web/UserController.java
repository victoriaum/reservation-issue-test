package com.example.hello.web;

import com.example.hello.service.StudentService;
import com.example.hello.service.TeacherService;
import com.example.hello.web.dto.StudentDto;
import com.example.hello.web.dto.TeacherDto;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequiredArgsConstructor
@Controller
public class UserController {
  private final TeacherService teacherService;
  private final StudentService studentService;

  @GetMapping("login")
  public String loginPage(HttpServletRequest request) {
    HttpSession session = request.getSession();
    session.removeAttribute("loginUser");
    session.removeAttribute("loginType");
    return "login";
  }

  @PostMapping("login")
  public String login(@RequestParam("inlineRadioOptions") String type, @RequestParam("id") String id,
                      @RequestParam("password") String password, Model m, HttpServletRequest request, HttpServletResponse response)
      throws IOException {

    HttpSession httpSession = request.getSession();

    if("1".equals(type)) {  // 교수로 로그인 하고자 하는 경우
      TeacherDto teacherDto = teacherService.findByTeacher_idAndTeacher_password(id, password);
      if(teacherDto==null){
        m.addAttribute("loginFailed","일치하는 회원이 없습니다. 다시 로그인해주세요!");
        return "login";
      }
      else {
        httpSession.setAttribute("loginUser",teacherDto);
        if("admin".equals(id)){ // 관리자인 경우
          httpSession.setAttribute("loginType","3");
          response.sendRedirect("admin");
          return "admin";
        } else {  // 교수인 경우
          httpSession.setAttribute("loginType",type);
          response.sendRedirect("index");
          return "index";
        }
      }

    } else {  // 학생으로 로그인 하고자 하는 경우
      StudentDto studentDto = studentService.findByStudent_idAndStudent_password(id, password);
      if(studentDto==null){
        m.addAttribute("loginFailed","일치하는 회원이 없습니다. 다시 로그인해주세요!");
        return "login";
      }
      else {
        httpSession.setAttribute("loginUser",studentDto);
        httpSession.setAttribute("loginType",type);
        response.sendRedirect("index");
        return "index";
      }
    }
  }
}
