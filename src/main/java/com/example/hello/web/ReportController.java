package com.example.hello.web;

import com.example.hello.service.ScheduleService;
import com.example.hello.service.TeacherService;
import com.example.hello.web.dto.SchedulerDto;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@RequiredArgsConstructor
@Controller
public class ReportController {
  private final TeacherService teacherService;
  private final ScheduleService scheduleService;

  SchedulerDto schedulerDto = new SchedulerDto();

  // 오늘 날짜 구하기
  LocalDate now = LocalDate.now();
  DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  String today = now.format(dateTimeFormatter);


  @RequestMapping("report_s")
  public String report_s(Model m) {
    List<String> deptList = teacherService.getDept();
    m.addAttribute("deptList",deptList);
    return "report_s";
  }

  @ResponseBody
  @RequestMapping("report_s/getTeacher")
  public String getTeacher(@RequestParam("checkedDept") String checkedDept) {
    List<String> teacherList = teacherService.getTeacher(checkedDept);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("teacherList", teacherList);
    return jsonObject.toString();
  }

  @ResponseBody
  @RequestMapping("report_s/getTeacherSchedule")
  public Object getTeacherSchedule(@RequestParam("checkedTeacher") String teacher_id) {
    List<SchedulerDto> scheduleList = scheduleService.getTeacherSchedule(teacher_id, today);
    return scheduleList;
  }

  @ResponseBody
  @RequestMapping("report_s/requestReport")
  public String requestReport(@RequestParam("schedule_no") Long schedule_no, @RequestParam("login_id") String login_id) {
    Integer result = scheduleService.requestReport(schedule_no, login_id);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("result", result);
    return jsonObject.toString();
  }

  @ResponseBody
  @RequestMapping("report_s/cancelReport")
  public String cancelReport(@RequestParam("schedule_no") Long schedule_no, @RequestParam("login_id") String login_id) {
    Integer result = scheduleService.cancelReport(schedule_no, login_id);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("result", result);
    return jsonObject.toString();
  }


  @ResponseBody
  @RequestMapping("report_s/openRequest")
  public String openRequest(@RequestParam("teacher_id") String teacher_id, HttpServletRequest request) {
    HttpSession httpSession = request.getSession();
    StudentDto studentDto = (StudentDto)httpSession.getAttribute("loginUser");
    String student_id = studentDto.getStudent_id();

    Integer result = teacherService.openRequest(teacher_id, student_id);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("result", result);
    return jsonObject.toString();
  }



  @ResponseBody
  @RequestMapping("report_s/revokeOpenRequest")
  public String revokeOpenRequest(@RequestParam("teacher_id") String teacher_id, HttpServletRequest request) {
    HttpSession httpSession = request.getSession();
    StudentDto studentDto = (StudentDto)httpSession.getAttribute("loginUser");
    String student_id = studentDto.getStudent_id();

    Integer result = teacherService.revokeOpenRequest(teacher_id, student_id);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("result", result);
    return jsonObject.toString();
  }



  @RequestMapping("report_t")
  public String report_t(HttpServletRequest request, Model m) {
    HttpSession httpSession = request.getSession();
    TeacherDto teacherDto = (TeacherDto)httpSession.getAttribute("loginUser");
    String teacher_id = teacherDto.getTeacher_id();

    List<SchedulerDto> scheduleList = scheduleService.getTeacherSchedule(teacher_id, today);


    if(scheduleList.size()==0) {
      m.addAttribute("schedule","등록한 일정이 없습니다.");
    } else {
      m.addAttribute("schedule","");
      m.addAttribute("scheduleList",scheduleList);
    }

    return "report_t";
  }

  @RequestMapping("report_t/makeSchedule")
  public String makeSchedule(@RequestParam("no") String no, HttpServletRequest request, Model m) {

    if(!"0".equals(no)){
      Long schedule_no = Long.parseLong(no);
      String schedule = scheduleService.findBySchedule_no(schedule_no);
      m.addAttribute("schedule", schedule);
    } else {
      m.addAttribute("no", no);
      m.addAttribute("schedule", "");
    }

    return "makeSchedule";
  }

  @RequestMapping("report_t/saveSchedule")
  public String saveSchedule(@RequestParam("date") String date,
                             @RequestParam("startTime") String start,
                             @RequestParam("endTime") String end,
                             @RequestParam("space") String space,
                             HttpServletRequest request, Model m) {

    HttpSession httpSession = request.getSession();
    TeacherDto teacherDto = (TeacherDto)httpSession.getAttribute("loginUser");
    String teacher_id = teacherDto.getTeacher_id();

    schedulerDto.setTeacher_id(teacher_id);
    schedulerDto.setSchedule_attender("");
    schedulerDto.setSchedule_date(date);
    schedulerDto.setSchedule_start(start);
    schedulerDto.setSchedule_end(end);
    schedulerDto.setSchedule_space(space);

    scheduleService.saveSchedule(schedulerDto);

    List<SchedulerDto> scheduleList = scheduleService.getTeacherSchedule(teacher_id, today);
    m.addAttribute("result","변경성공");
    m.addAttribute("scheduleList",scheduleList);

    return "/report_t";
  }


  @RequestMapping("report_t/editSchedule")
  public String editSchedule(@RequestParam("no") String no,
                              @RequestParam("date") String date,
                              @RequestParam("startTime") String start,
                              @RequestParam("endTime") String end,
                              @RequestParam("space") String space,
                              Model m) {

    Long schedule_no = Long.parseLong(no);
    scheduleService.editSchedule(schedule_no, date, start, end, space);
    m.addAttribute("result","변경성공");
    m.addAttribute("","");

    return "/report_t";
  }


  @ResponseBody
  @RequestMapping("report_t/deleteSchedule")
  public String deleteSchedule(@RequestParam("no") String schedule_no, Model m) {
    Long no = Long.parseLong(schedule_no);
    scheduleService.deleteById(no);
    return "삭제성공";
  }
}
