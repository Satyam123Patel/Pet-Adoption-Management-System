package com.petadoption.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Added explicit CORS
public class AdminDashboardController {

    @Autowired
    private JdbcTemplate jdbc;

    // 1️⃣ Total users
    @GetMapping("/users")
    public Map<String, Object> getTotalUsers() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
        return Map.of("count", count != null ? count : 0);
    }

    // 2️⃣ Total pets (from pet table)
    @GetMapping("/pets")
    public Map<String, Object> getTotalPets() {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM pet WHERE status = 'available'", Integer.class);
        return Map.of("count", count != null ? count : 0);
    }

    // 3️⃣ Total adoption requests (PENDING status only)
    @GetMapping("/requests")
    public Map<String, Object> getTotalRequests() {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM adoption_requests WHERE status = 'PENDING'",
                Integer.class);
        return Map.of("count", count != null ? count : 0);
    }

    // 4️⃣ Total adopted pets (APPROVED status)
    @GetMapping("/adopted")
    public Map<String, Object> getAdoptedPets() {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM adoption_requests WHERE status = 'APPROVED'",
                Integer.class);
        return Map.of("count", count != null ? count : 0);
    }

    // 5️⃣ Pet type distribution (by category)
    @GetMapping("/pet-types")
    public List<Map<String, Object>> getPetTypes() {
        return jdbc.query(
                "SELECT category AS type, COUNT(*) AS count FROM pet GROUP BY category",
                (rs, rowNum) -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("_id", rs.getString("type"));
                    map.put("count", rs.getInt("count"));
                    return map;
                });
    }

    // 6️⃣ Monthly adoption stats
    @GetMapping("/monthly")
    public List<Map<String, Object>> getMonthlyStats() {
        return jdbc.query(
                """
                        SELECT
                          DATE_FORMAT(created_at, '%b') AS month,
                          COUNT(*) AS requests,
                          SUM(CASE WHEN status='APPROVED' THEN 1 ELSE 0 END) AS adoptions
                        FROM adoption_requests
                        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                        GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
                        ORDER BY DATE_FORMAT(created_at, '%Y-%m')
                        """,
                (rs, rowNum) -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", rs.getString("month"));
                    map.put("requests", rs.getInt("requests"));
                    map.put("adoptions", rs.getInt("adoptions"));
                    return map;
                });
    }
}