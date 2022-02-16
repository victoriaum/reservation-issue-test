package com.example.hello.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Component
public class LoginInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    HttpSession session = request.getSession();
    String loginType = (String) session.getAttribute("loginType");

    // 리다이랙션 방지
    String requestUrl = request.getRequestURL().toString();
    if(requestUrl.contains("/login")){
      return true;
    }

    if(ObjectUtils.isEmpty(loginType)){
      response.sendRedirect("/login");
      return false;
    }else{
      session.setMaxInactiveInterval(30*60);
      return true;
    }

  }

  @Override
  public void postHandle(HttpServletRequest request,
      HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
      throws Exception {
  }

}
