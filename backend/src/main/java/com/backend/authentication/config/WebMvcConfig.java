package com.backend.authentication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Chỉ định thư mục để phục vụ các tệp tĩnh
        registry.addResourceHandler("/user-avatars/**")
                .addResourceLocations("file:./user-avatars/");

        // Thêm vào để phục vụ các tệp tĩnh từ thư mục resources/static
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");

    }

}
