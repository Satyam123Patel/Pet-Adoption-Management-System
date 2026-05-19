package com.petadoption.service;

import com.petadoption.entity.OtpVerification;
import com.petadoption.repository.OtpRepository;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${mail.from}")
    private String fromEmail;

    public void sendOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpVerification entity = new OtpVerification();
        entity.setEmail(email);
        entity.setOtp(otp);
        entity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        entity.setVerified(false);

        otpRepository.save(entity);

        Email from = new Email(fromEmail);
        Email to = new Email(email);
        String subject = "Your OTP for Pet Adoption App";
        Content content = new Content("text/plain",
                "Your OTP is: " + otp + "\nValid for 5 minutes.");

        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            System.out.println("✅ SendGrid Status: " + response.getStatusCode());
            System.out.println("✅ SendGrid Body: " + response.getBody());

            if (response.getStatusCode() >= 400) {
                System.out.println("❌ SendGrid Error: " + response.getBody());
                throw new RuntimeException("SendGrid error: " + response.getBody());
            }

        } catch (IOException e) {
            System.out.println("❌ IOException: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findTopByEmailOrderByIdDesc(email)
                .filter(o -> o.getOtp().equals(otp))
                .filter(o -> o.getExpiryTime().isAfter(LocalDateTime.now()))
                .map(o -> {
                    o.setVerified(true);
                    otpRepository.save(o);
                    return true;
                })
                .orElse(false);
    }
}