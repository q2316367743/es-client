package xyz.esion.esclient.config;

import cn.hutool.json.JSONUtil;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import xyz.esion.esclient.enumeration.ResultCodeEnum;
import xyz.esion.esclient.global.Result;
import xyz.esion.esclient.property.EsClientProperty;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Esion
 * @since 2022/9/25
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final EsClientProperty property;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowCredentials(true)
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .exposedHeaders("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
                    @Override
                    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) throws Exception {
                        if (request.getMethod().equals("OPTIONS")) {
                            return true;
                        }
                        String token = request.getHeader("token");
                        if (property.getToken().equals(token)) {
                            return true;
                        }else {
                            response.getWriter().print(JSONUtil.toJsonStr(Result.error(ResultCodeEnum.AUTH_ERROR)));
                            return false;
                        }
                    }
                }).addPathPatterns("/api/test")
                .excludePathPatterns("/api/auth/login");
    }
}
