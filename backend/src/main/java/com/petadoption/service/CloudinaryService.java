package com.petadoption.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@Service
public class CloudinaryService {

        @Value("${CLOUDINARY_CLOUD_NAME:${cloudinary.cloud-name:}}")
        private String cloudName;

        @Value("${CLOUDINARY_API_KEY:${cloudinary.api-key:}}")
        private String apiKey;

        @Value("${CLOUDINARY_API_SECRET:${cloudinary.api-secret:}}")
        private String apiSecret;

        private Cloudinary cloudinary;

        @PostConstruct
        public void init() {
                if (cloudName != null && !cloudName.isBlank()) {
                        cloudinary = new Cloudinary(
                                        ObjectUtils.asMap(
                                                        "cloud_name", cloudName,
                                                        "api_key", apiKey,
                                                        "api_secret", apiSecret));
                        System.out.println("Cloudinary initialized!");
                } else {
                        System.out.println("Cloudinary credentials not configured, upload service in standby.");
                }
        }

        public String uploadImage(
                        MultipartFile file) throws Exception {
                if (cloudinary == null) {
                        throw new IllegalStateException("Cloudinary is not configured. Please set Cloudinary credentials.");
                }
                Map result = cloudinary.uploader()
                                .upload(file.getBytes(),
                                                ObjectUtils.emptyMap());
                String url = result.get("url").toString();
                System.out.println(
                                "Image uploaded to Cloudinary: " + url);
                return url;
        }
}