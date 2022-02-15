package com.example.hello.web.dto;

import com.example.hello.domain.Scheduler;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SchedulerDto {
  private Long schedule_no;
  private String teacher_id;
  private String schedule_attender;
  private String schedule_date;
  private String schedule_start;
  private String schedule_end;
  private String schedule_space;

  public SchedulerDto(Scheduler entity){
    this.schedule_no = entity.getSchedule_no();
    this.teacher_id = entity.getTeacher_id();
    this.schedule_attender = entity.getSchedule_attender();
    this.schedule_date = entity.getSchedule_date();
    this.schedule_start = entity.getSchedule_start();
    this.schedule_end = entity.getSchedule_end();
    this.schedule_space = entity.getSchedule_space();
  }

  public Scheduler toEntity(){
    return Scheduler.builder()
        .schedule_no(schedule_no)
        .schedule_attender(schedule_attender)
        .teacher_id(teacher_id)
        .schedule_date(schedule_date)
        .schedule_start(schedule_start)
        .schedule_end(schedule_end)
        .schedule_space(schedule_space)
        .build();
  }

}
