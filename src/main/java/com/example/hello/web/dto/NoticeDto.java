package com.example.hello.web.dto;

import com.example.hello.domain.Notice;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class NoticeDto {
  private Long notice_no;
  private String writer_id;
  private String writer_name;
  private String writer_position;
  private String notice_view;
  private String notice_title;
  private String notice_contents;
  private String notice_create_date;
  private String notice_edit_date;
  private String notice_delete_date;


  public NoticeDto(Notice entity){
    this.notice_no = entity.getNotice_no();
    this.writer_id = entity.getWriter_id();
    this.writer_name = entity.getWriter_name();
    this.writer_position = entity.getWriter_position();
    this.notice_view = entity.getNotice_view();
    this.notice_title = entity.getNotice_title();
    this.notice_contents = entity.getNotice_contents();
    this.notice_create_date = entity.getNotice_create_date();
    this.notice_edit_date = entity.getNotice_edit_date();
    this.notice_delete_date = entity.getNotice_delete_date();
  }

  public Notice toEntity(){
    return Notice.builder()
        .writer_id(writer_id)
        .writer_name(writer_name)
        .writer_position(writer_position)
        .notice_view(notice_view)
        .notice_title(notice_title)
        .notice_contents(notice_contents)
        .notice_create_date(notice_create_date)
        .notice_edit_date(notice_edit_date)
        .notice_delete_date(notice_delete_date)
        .build();
  }

}
