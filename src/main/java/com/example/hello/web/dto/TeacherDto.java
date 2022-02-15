package com.example.hello.web.dto;

import com.example.hello.domain.Teacher;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class TeacherDto {
  private Long teacher_no;
  private String teacher_id;
  private String teacher_password;
  private String teacher_name;
  private String teacher_email;
  private String teacher_dept;
  private String teacher_position;
  private String request_students;

  public TeacherDto(Teacher entity){
    this.teacher_no = entity.getTeacher_no();
    this.teacher_id = entity.getTeacher_id();
    this.teacher_password = entity.getTeacher_password();
    this.teacher_name = entity.getTeacher_name();
    this.teacher_email = entity.getTeacher_email();
    this.teacher_dept = entity.getTeacher_dept();
    this.teacher_position = entity.getTeacher_position();
    this.request_students = entity.getRequest_students();
  }

  public Teacher toEntity(){
    return Teacher.builder()
        .teacher_no(teacher_no)
        .teacher_id(teacher_id)
        .teacher_password(teacher_password)
        .teacher_name(teacher_name)
        .teacher_email(teacher_email)
        .teacher_dept(teacher_dept)
        .teacher_position(teacher_position)
        .request_students(request_students)
        .build();
  }

}
