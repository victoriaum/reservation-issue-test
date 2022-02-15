package com.example.hello.web;

import com.example.hello.service.ScheduleService;
import com.example.hello.service.StudentService;
import com.example.hello.web.dto.StudentDto;
import com.example.hello.web.dto.TeacherDto;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RequiredArgsConstructor
@Controller
public class ScheduleController {

  private final ScheduleService scheduleService;
  private final StudentService studentService;


  @RequestMapping("schedule")
  public String schedule(HttpServletRequest request, Model m) {
    HttpSession httpSession = request.getSession();
    String type = (String) httpSession.getAttribute("loginType");
    return "schedule";
  }

  @ResponseBody
  @RequestMapping("getSchedule")
  public String getSchedule(@RequestParam("startDate") String startDate,
      @RequestParam("endDate") String endDate,
      HttpServletRequest request) {

    HttpSession httpSession = request.getSession();
    String type = (String) httpSession.getAttribute("loginType");
    List<String> scheduleList;
    JSONObject jsonObject = new JSONObject();

    if ("1".equals(type)) {  // 선생님이 로그인한 경우
      TeacherDto teacherDto = (TeacherDto) httpSession.getAttribute("loginUser");
      String teacher_id = teacherDto.getTeacher_id();
      scheduleList = scheduleService.getTeacherWeekSchedule(teacher_id, startDate, endDate);
      jsonObject.put("scheduleList", scheduleList);
    }
    else if("2".equals(type)) {  // 학생이 로그인한 경우
      StudentDto studentDto = (StudentDto) httpSession.getAttribute("loginUser");
      String student_id = studentDto.getStudent_id();
      scheduleList = scheduleService.getStudentWeekSchedule(student_id, startDate, endDate);
      jsonObject.put("scheduleList", scheduleList);
    }

    return jsonObject.toString();
  }

  @ResponseBody
  @RequestMapping("getNameList")
  public String getNameList(@RequestParam("attenders") String attenders,
      HttpServletRequest request) {

    HttpSession httpSession = request.getSession();
    String[] attenderList = attenders.split(",");
    String nameList = "";

    for (int i = 0; i < attenderList.length; i++) {
      if (i == 0) {
        nameList = studentService.getNameList(attenderList[i]);
      } else {
        nameList += ", " + studentService.getNameList(attenderList[i]);
      }
    }

    JSONObject jsonObject = new JSONObject();
    jsonObject.put("nameList", nameList);
    return jsonObject.toString();
  }


  @ResponseBody
  @RequestMapping("requestCancel")
  public String requestCancel(@RequestParam("schedule_no") Long schedule_no,
      HttpServletRequest request) {

    HttpSession httpSession = request.getSession();
    StudentDto studentDto = (StudentDto) httpSession.getAttribute("loginUser");
    String login_id = studentDto.getStudent_id();

    scheduleService.cancelReport(schedule_no, login_id);

    JSONObject jsonObject = new JSONObject();
    jsonObject.put("result", "취소성공");
    return jsonObject.toString();
  }
}