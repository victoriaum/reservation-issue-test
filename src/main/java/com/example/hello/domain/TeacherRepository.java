package com.example.hello.domain;

import com.example.hello.web.dto.TeacherDto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TeacherRepository extends JpaRepository<Teacher, String> {

  @Query("SELECT t FROM Teacher t WHERE t.teacher_id=:id and t.teacher_password=:password")
  List<TeacherDto> findByTeacher_idAndTeacher_password(@Param("id") String id, @Param("password") String password);

  @Query("SELECT DISTINCT t.teacher_dept FROM Teacher t")
  List<String> getDept();

  @Query("SELECT t.teacher_name, t.teacher_position, t.teacher_id, t.request_students FROM Teacher t WHERE t.teacher_dept=:checkedDept")
  List<String> findByTeacher_dept(@Param("checkedDept") String checkedDept);

  @Query("SELECT t FROM Teacher t WHERE t.teacher_id=:id")
  TeacherDto findByTeacher_id(@Param("id") String id);

}
