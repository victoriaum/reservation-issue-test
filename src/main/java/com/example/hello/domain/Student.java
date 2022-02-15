package com.example.hello.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Student {

  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  private Long student_no;

  @Column(columnDefinition = "TEXT", length=100, nullable = false, unique = true)
  private String student_id;

  @Column(columnDefinition = "TEXT", length=100, nullable = false)
  private String student_password;
  private String student_name;
  private String student_email;
  private String student_grade;

  @Builder
  public Student(Long student_no, String student_id, String student_password, String student_name,
                      String student_email, String student_grade){
    this.student_no = student_no;
    this.student_id = student_id;
    this.student_password = student_password;
    this.student_name = student_name;
    this.student_email = student_email;
    this.student_grade = student_grade;
  }





}
