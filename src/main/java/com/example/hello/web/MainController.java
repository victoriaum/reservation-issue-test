package com.example.hello.web;

import com.example.hello.service.ScheduleService;
import com.example.hello.service.TeacherService;
import com.example.hello.web.dto.StudentDto;
import com.example.hello.web.dto.TeacherDto;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RequiredArgsConstructor
@Controller
public class MainController {
  private final ScheduleService scheduleService;
  private final TeacherService teacherService;


  // 오늘 날짜 구하기
  LocalDate now = LocalDate.now();
  DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  String today = now.format(dateTimeFormatter);


  @RequestMapping(value = {"/"})
  public String mainPage() {
    return "index";
  }

  @RequestMapping(value = {"/home"})
  public String home() {
    return "home";
  }

  /*@RequestMapping(value = {"/"})
  public String mainPage(HttpServletRequest request) {
    HttpSession httpSession = request.getSession();
    String type = (String)httpSession.getAttribute("loginType");
    if("3".equals(type)){
      return "admin";
    } else {
      return "index";
    }
  }*/

  @RequestMapping(value = {"index"})
  public String index() {
    return "index";
  }

  @ResponseBody
  @RequestMapping(value = {"getTodaySchedule"})
  public String getTodaySchedule(HttpServletRequest request, Model m) {
    HttpSession httpSession = request.getSession();
    String type = (String)httpSession.getAttribute("loginType");
    List<String> scheduleList;
    JSONObject jsonObject = new JSONObject();

    if("1".equals(type)){  // 선생님이 로그인한 경우
      TeacherDto teacherDto = (TeacherDto)httpSession.getAttribute("loginUser");
      String teacher_id = teacherDto.getTeacher_id();
      scheduleList = scheduleService.getTodayTeacherSchedule(teacher_id, today);
      jsonObject.put("scheduleList", scheduleList);
    }
    else if("2".equals(type)) {  // 학생이 로그인한 경우
      StudentDto studentDto = (StudentDto)httpSession.getAttribute("loginUser");
      String student_id = studentDto.getStudent_id();
      scheduleList = scheduleService.getTodayStudentSchedule(student_id, today);
      jsonObject.put("scheduleList", scheduleList);
    }

    return jsonObject.toString();
  }


  @ResponseBody
  @RequestMapping(value = {"index/requestCnt"})
  public String requestCnt(HttpServletRequest request, Model m) {
    HttpSession httpSession = request.getSession();
    TeacherDto teacherDto = (TeacherDto)httpSession.getAttribute("loginUser");
    String teacher_id = teacherDto.getTeacher_id();

    // 일정이 하나라도 있으면 요청인원 초기화
    scheduleService.requestCntManage(teacherDto,today);

    Integer requestCnt = teacherService.requestCnt(teacher_id);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("requestCnt", requestCnt);
    return jsonObject.toString();
  }

  @ResponseBody
  @RequestMapping(value = {"index/requestCntDelete"})
  public void requestCntDelete(HttpServletRequest request, Model m) {
    HttpSession httpSession = request.getSession();
    TeacherDto teacherDto = (TeacherDto)httpSession.getAttribute("loginUser");
    teacherDto.setRequest_students("");
    teacherService.requestCntDelete(teacherDto);
  }

}
