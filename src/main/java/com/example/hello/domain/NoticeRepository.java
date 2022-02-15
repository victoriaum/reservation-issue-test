package com.example.hello.domain;

import java.util.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface NoticeRepository extends JpaRepository<Notice, Long> {

  @Query("SELECT n FROM Notice n")
  Collection<Notice> findByNotice_view(@Param("loginType") String loginType);
}

