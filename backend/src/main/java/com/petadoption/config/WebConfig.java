package com.petadoption.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Value("${file.upload-dir}")
        private String uploadDir;

        @Value("${app.cors.allowed-origin}")
        private String corsOrigin;

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/images/**")
                                .addResourceLocations(
                                                "file:" + uploadDir + "/",
                                                "classpath:/static/images/")
                                .setCachePeriod(3600);

                System.out.println("✅ Image handler configured:");
                System.out.println("✅   - User uploads: " + uploadDir);
                System.out.println("✅   - Sample pets: classpath:/static/images/");
        }

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                // FIXED: split multiple origins correctly
                                .allowedOrigins(corsOrigin.split(","))
                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                .allowedHeaders("*")
                                .allowCredentials(true);
        }
}