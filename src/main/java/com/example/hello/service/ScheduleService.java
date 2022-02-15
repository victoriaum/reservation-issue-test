package com.example.hello.service;

import com.example.hello.domain.SchedulerRepository;
import com.example.hello.domain.TeacherRepository;
import com.example.hello.web.dto.SchedulerDto;
import com.example.hello.web.dto.TeacherDto;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ScheduleService {
  private final SchedulerRepository schedulerRepository;
  private final TeacherRepository teacherRepository;

  @Transactional
  public List<SchedulerDto> getTeacherSchedule(String teacher_id, String today) {
    return schedulerRepository.getTeacherSchedule(teacher_id, today).stream()
        .map(SchedulerDto::new)
        .collect(Collectors.toList());
  }

  @Transactional
  public List<String> getTodayTeacherSchedule(String teacher_id, String today) {
    return schedulerRepository.getTodayTeacherSchedule(teacher_id, today);
  }

  @Transactional
  public List<String> getTodayStudentSchedule(String student_id, String today) {
    return schedulerRepository.getTodayStudentSchedule(student_id, today);
  }

  @Transactional
  public List<String> getTeacherWeekSchedule(String teacher_id, String startDate, String endDate) {
    return schedulerRepository.getTeacherWeekSchedule(teacher_id, startDate, endDate);
  }

  @Transactional
  public List<String> getStudentWeekSchedule(String student_id, String startDate, String endDate) {
    return schedulerRepository.getStudentWeekSchedule(student_id, startDate, endDate);
  }

  @Transactional
  public Integer requestReport(Long schedule_no, String login_id) {
    String attenders = schedulerRepository.checkAttenders(schedule_no);
    String[] attenderArray = attenders.split(",");

    for(int i=0; i<attenderArray.length; i++){
      if(login_id.equals(attenderArray[i])){ // 일정 내 현재 요청한 참여자가 있는 경우
        return 0;
      }
    }

    // 일정 내 현재 요청한 참여자가 없는 경우
    if(attenders.isEmpty()){
      attenders = login_id;
    } else {
      attenders = attenders + "," + login_id;
    }
    SchedulerDto schedulerDto = schedulerRepository.getOneSchedule(schedule_no);
    schedulerDto.setSchedule_attender(attenders);
    schedulerRepository.save(schedulerDto.toEntity());
    return 1;

  }

  @Transactional
  public Integer cancelReport(Long schedule_no, String login_id) {
    String attenders = schedulerRepository.checkAttenders(schedule_no);

    if(attenders!=null && attenders.contains(login_id)){ // 일정 내 현재 요청한 참여자가 있는 경우
      if(attenders.contains(",")){
        String[] attendersArray = attenders.split(",");
        List<String> tempList = new ArrayList<String>(Arrays.asList(attendersArray));
        tempList.remove(login_id);
        attenders = tempList.toString();
        attenders = attenders.substring(1,attenders.length()-1);
      } else {
        attenders = "";
      }
      SchedulerDto schedulerDto = schedulerRepository.getOneSchedule(schedule_no);
      schedulerDto.setSchedule_attender(attenders);
      schedulerRepository.save(schedulerDto.toEntity());
      return 1;

    } else {  // 일정 내 현재 요청한 참여자가 없는 경우
      return 0;
    }
  }

  @Transactional
  public String findBySchedule_no(Long schedule_no) {
    String schedule = schedulerRepository.findBySchedule_no(schedule_no);
    return schedule;
  }

  @Transactional
  public void saveSchedule(SchedulerDto schedulerDto){
    schedulerRepository.save(schedulerDto.toEntity());
  }

  @Modifying
  @Transactional
  public void deleteById(Long no) {
    schedulerRepository.deleteById(no);
  }

  @Transactional
  public void editSchedule(Long no, String date, String start, String end, String space) {
    SchedulerDto schedulerDto = schedulerRepository.getOneSchedule(no);
    schedulerDto.setSchedule_date(date);
    schedulerDto.setSchedule_start(start);
    schedulerDto.setSchedule_end(end);
    schedulerDto.setSchedule_space(space);
    schedulerRepository.save(schedulerDto.toEntity());
  }

  @Transactional
  public void requestCntManage(TeacherDto teacherDto, String today) {
    int i = schedulerRepository.scheduleCnt(teacherDto.getTeacher_id(), today);
    if(i!=0){
      teacherDto.setRequest_students("");
      teacherRepository.save(teacherDto.toEntity());
    }
  }
}
