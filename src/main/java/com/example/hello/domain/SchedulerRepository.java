package com.example.hello.domain;

import com.system.reservation.web.dto.SchedulerDto;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchedulerRepository extends JpaRepository<com.system.reservation.domain.Scheduler, Long> {

  @Query("SELECT s FROM Scheduler s WHERE s.teacher_id=:teacher_id AND s.schedule_date>=:today"
      + " ORDER BY s.schedule_date, s.schedule_start ASC")
  Collection<com.system.reservation.domain.Scheduler> getTeacherSchedule(@Param("teacher_id") String teacher_id, @Param("today") String today);

  @Query("SELECT s.schedule_no, s.schedule_start, s.schedule_end, s.schedule_space, s.schedule_attender"
      + " FROM Scheduler s WHERE s.teacher_id=:teacher_id AND s.schedule_date=:today"
      + " ORDER BY s.schedule_date, s.schedule_start ASC")
  List<String> getTodayTeacherSchedule(@Param("teacher_id") String teacher_id, @Param("today") String today);

  @Query("SELECT s.schedule_no, s.schedule_start, t.teacher_dept, t.teacher_name, t.teacher_position"
      + " FROM Scheduler s LEFT JOIN Teacher t"
      + " ON s.teacher_id = t.teacher_id"
      + " WHERE s.schedule_date=:today"
      + " AND (s.schedule_attender=:student_id OR s.schedule_attender LIKE CONCAT(:student_id,',','%') "
      + " OR s.schedule_attender LIKE CONCAT('%',',',:student_id) OR s.schedule_attender LIKE CONCAT('%',',',:student_id,',','%'))"
      + " ORDER BY s.schedule_date, s.schedule_start ASC")
  List<String> getTodayStudentSchedule(@Param("student_id") String student_id, @Param("today") String today);

  @Query("SELECT s.schedule_no, s.schedule_date, s.schedule_start, s.schedule_end, s.schedule_space, s.schedule_attender "
      + " FROM Scheduler s WHERE s.teacher_id=:teacher_id AND s.schedule_date>=:startDate AND s.schedule_date<=:endDate "
      + " ORDER BY s.schedule_date, s.schedule_start ASC")
  List<String> getTeacherWeekSchedule(@Param("teacher_id") String teacher_id, @Param("startDate") String startDate, @Param("endDate") String endDate);

  @Query("SELECT s.schedule_no, s.schedule_date, s.schedule_start, s.schedule_end, t.teacher_dept, t.teacher_name, t.teacher_position, s.schedule_attender"
      + " FROM Scheduler s LEFT JOIN Teacher t"
      + " ON s.teacher_id = t.teacher_id"
      + " WHERE s.schedule_date>=:startDate AND s.schedule_date<=:endDate"
      + " AND (s.schedule_attender=:student_id OR s.schedule_attender LIKE CONCAT(:student_id,',','%') "
      + " OR s.schedule_attender LIKE CONCAT('%',',',:student_id) OR s.schedule_attender LIKE CONCAT('%',',',:student_id,',','%'))"
      + " ORDER BY s.schedule_date, s.schedule_start ASC")
  List<String> getStudentWeekSchedule(@Param("student_id") String student_id, @Param("startDate") String startDate, @Param("endDate") String endDate);

  @Query("SELECT s.schedule_attender FROM Scheduler s WHERE s.schedule_no=:schedule_no")
  String checkAttenders(@Param("schedule_no") Long schedule_no);

  @Query("SELECT s.schedule_no, s.schedule_date, s.schedule_start, s.schedule_end, s.schedule_attender, s.schedule_space "
      + "FROM Scheduler s WHERE s.schedule_no=:schedule_no")
  String findBySchedule_no(@Param("schedule_no") Long schedule_no);

  @Query("SELECT s FROM Scheduler s WHERE s.schedule_no=:schedule_no")
  SchedulerDto getOneSchedule(@Param("schedule_no") Long schedule_no);

  @Query("SELECT count(s) FROM Scheduler s WHERE s.teacher_id=:teacher_id AND s.schedule_date>=:today")
  Integer scheduleCnt(@Param("teacher_id") String teacher_id, @Param("today") String today);

}

