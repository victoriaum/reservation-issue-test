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
public class Notice {

  @Id
  @GeneratedValue(strategy= GenerationType.IDENTITY)
  private Long notice_no;

  @Column(columnDefinition = "TEXT", length=600, nullable = false)
  private String writer_id;
  private String writer_name;
  private String writer_position;

  private String notice_view;
  private String notice_title;
  private String notice_contents;

  @Column(columnDefinition = "TEXT", length = 600)
  private String notice_create_date;
  private String notice_edit_date;
  private String notice_delete_date;


  @Builder
  public Notice(String writer_id, String writer_name, String writer_position,
      String notice_view, String notice_title, String notice_contents,
      String notice_create_date, String notice_edit_date, String notice_delete_date){
    this.writer_id = writer_id;
    this.writer_name = writer_name;
    this.writer_position = writer_position;
    this.notice_view = notice_view;
    this.notice_title = notice_title;
    this.notice_contents = notice_contents;
    this.notice_create_date = notice_create_date;  /* 형식: 2021-12-10 */
    this.notice_edit_date = notice_edit_date;
    this.notice_delete_date = notice_delete_date;
  }





}
