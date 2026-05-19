//1
package com.petadoption.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final String uploadDir = "C:/pet-adoption-storage/";

    public String savePendingPetImage(MultipartFile file)
            throws IOException {

        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        String fileName = System.currentTimeMillis() +
                "_" + file.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);

        Files.copy(
                file.getInputStream(),
                path,
                StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName;
    }
}
