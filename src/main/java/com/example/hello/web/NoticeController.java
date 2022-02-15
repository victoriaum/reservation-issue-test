package com.example.hello.web;

import com.example.hello.service.NoticeService;
import com.example.hello.web.dto.NoticeDto;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
public class NoticeController {

  private final NoticeService noticeService;

  // 오늘 날짜 구하기
  LocalDate now = LocalDate.now();
  String todayDate = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
  String year = now.format(DateTimeFormatter.ofPattern("yyyy"));
  String month = now.format(DateTimeFormatter.ofPattern("MM"));
  String day = now.format(DateTimeFormatter.ofPattern("dd"));
  int dayCnt = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month),1).lengthOfMonth();


  @RequestMapping("notice")
  public String notice(HttpServletRequest request, Model m) {

    HttpSession httpSession = request.getSession();
    String type = (String)httpSession.getAttribute("loginType");

    if("1".equals(type)){
      type="teacher";
    }
    else if("2".equals(type)) {
      type="student";
    }

    List<NoticeDto> noticeList = noticeService.noticeInfo(type);
    m.addAttribute("noticeList",noticeList);

    return "notice";
  }

}