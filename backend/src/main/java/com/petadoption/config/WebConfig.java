package com.petadoption.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // Serve pending pet images
                registry.addResourceHandler("/images/pending/**")
                                .addResourceLocations("file:D:/Petpostedimages/");

                // Serve approved/adopted pet images
                registry.addResourceHandler("/images/**")
                                .addResourceLocations("file:D:/Adoptionpetimages/");

                // Alternative: if images are in project resources
                registry.addResourceHandler("/images/**")
                                .addResourceLocations("classpath:/static/images/");
        }

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                .allowedOrigins("http://localhost:5173")
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true);
        }
}
