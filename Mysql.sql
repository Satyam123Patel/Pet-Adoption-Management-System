-- ========================================
-- PET ADOPTION & TRACKING MANAGEMENT SYSTEM
-- DATABASE SETUP SCRIPT
-- ========================================

CREATE DATABASE IF NOT EXISTS pet_adoption_and_tracking_management_system_check;
USE pet_adoption_and_tracking_management_system_check;

-- ========================================
-- 1. CREATE TABLES
-- ========================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'ADMIN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Shelters Table
CREATE TABLE IF NOT EXISTS shelters (
    shelter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Main Pets Table (approved pets for adoption)
CREATE TABLE IF NOT EXISTS pet (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT,
    gender CHAR(1) DEFAULT 'U',
    status VARCHAR(20) DEFAULT 'available',
    image_url VARCHAR(255),
    shelter_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- Pending Pets Table (user submissions awaiting approval)
CREATE TABLE IF NOT EXISTS pets_pending (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT,
    gender VARCHAR(10),
    location VARCHAR(100),
    description TEXT,
    phone VARCHAR(20),
    image_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Adoption Requests Table
CREATE TABLE IF NOT EXISTS adoption_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pet_id BIGINT NOT NULL,
    living_situation TEXT,
    previous_experience TEXT,
    family_composition TEXT,
    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_adoption_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_adoption_pet FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_pet_id (pet_id),
    INDEX idx_status (status)
);

-- OTP Verification Table
CREATE TABLE IF NOT EXISTS otp_verification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiry_time DATETIME NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email)
);

-- Tracking Table (for adopted pets)
CREATE TABLE IF NOT EXISTS tracking (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    location VARCHAR(255),
    note TEXT,
    vet_visit_date DATE,
    vaccinated BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id)
);

-- ========================================
-- 2. INSERT INITIAL DATA
-- ========================================

-- Insert shelters
INSERT INTO shelters (name, address, phone, email) VALUES
('Happy Paws Shelter', 'Plot 21, Green Street, Mumbai', '9876543210', 'contact@happypaws.org'),
('Animal Care Center', 'Sec 12, Baner, Pune', '9988776655', 'support@animalcare.in'),
('Rescue & Love Foundation', 'Park Road, Nagpur', '9090909090', 'info@rescueandlove.org');

-- Insert sample pets
INSERT INTO pet (name, category, breed, age, gender, status, image_url, shelter_id) VALUES
('Bruno',  'dog',    'Labrador',        3, 'M', 'available', '1718906386213-550689756.jpg',  1),
('Lucy',   'dog',    'Beagle',          2, 'F', 'available', '1718906531802-606585739.jpg',  1),
('Mia',    'cat',    'Persian',         1, 'F', 'available', '1718906182775-8078205.jpeg',   2),
('Oscar',  'cat',    'Siamese',         5, 'M', 'available', '1718906085691-433161642.jpeg', 2),
('Rocky',  'dog',    'Golden Retriever',3, 'M', 'available', '1718906473944-923464963.jpg',  3),
('Ginger', 'rabbit', 'Cottontail',      6, 'F', 'available', '1718906609733-573010075.jpg',  3),
('Chirpy', 'bird',   'Parrot',          2, 'U', 'available', '1718907085550-787999544.jpg',  2),
('Goldy',  'fish',   'Goldfish',        1, 'M', 'available', '1718906809727-756049182.jpg',  1),
('Nemo',   'fish',   'Clown',           1, 'M', 'available', '1718906865077-840488064.jpg',  1),
('White',  'rabbit', 'Normal',          1, 'F', 'available', '1718906609733-573010075.jpg',  3);

-- Insert test user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Test User', 'user@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER');

-- Insert test tracking record
INSERT INTO tracking (pet_id, location, note, vet_visit_date, vaccinated, updated_at)
VALUES (1, 'Mumbai', 'General health check-up', '2026-01-20', TRUE, NOW());

-- ========================================
-- 3. TRIGGERS
-- ========================================

DROP TRIGGER IF EXISTS trg_update_pet_status_after_request;
DROP TRIGGER IF EXISTS trg_set_decision_date;

DELIMITER $$

CREATE TRIGGER trg_update_pet_status_after_request
AFTER UPDATE ON adoption_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'APPROVED' THEN
        UPDATE pet SET status = 'adopted' WHERE id = NEW.pet_id;
    ELSEIF NEW.status = 'REJECTED' THEN
        UPDATE pet SET status = 'available' WHERE id = NEW.pet_id;
    ELSEIF NEW.status = 'PENDING' THEN
        UPDATE pet SET status = 'pending' WHERE id = NEW.pet_id;
    END IF;
END$$

CREATE TRIGGER trg_set_decision_date
BEFORE UPDATE ON adoption_requests
FOR EACH ROW
BEGIN
    IF NEW.status IN ('APPROVED', 'REJECTED') AND OLD.status = 'PENDING' THEN
        SET NEW.updated_at = NOW();
    END IF;
END$$

DELIMITER ;

-- ========================================
-- 4. STORED PROCEDURES
-- ========================================

DROP PROCEDURE IF EXISTS submit_adoption_request;
DROP PROCEDURE IF EXISTS approve_adoption_request;
DROP PROCEDURE IF EXISTS reject_adoption_request;
DROP PROCEDURE IF EXISTS get_pending_requests;

DELIMITER $$

CREATE PROCEDURE submit_adoption_request(
    IN p_user_id BIGINT,
    IN p_pet_id BIGINT,
    IN p_living_situation TEXT,
    IN p_previous_experience TEXT,
    IN p_family_composition TEXT
)
BEGIN
    INSERT INTO adoption_requests (user_id, pet_id, living_situation, previous_experience, family_composition, status)
    VALUES (p_user_id, p_pet_id, p_living_situation, p_previous_experience, p_family_composition, 'PENDING');
    UPDATE pet SET status = 'pending' WHERE id = p_pet_id;
END$$

CREATE PROCEDURE approve_adoption_request(IN p_request_id BIGINT)
BEGIN
    UPDATE adoption_requests SET status = 'APPROVED' WHERE id = p_request_id;
END$$

CREATE PROCEDURE reject_adoption_request(IN p_request_id BIGINT)
BEGIN
    UPDATE adoption_requests SET status = 'REJECTED' WHERE id = p_request_id;
END$$

CREATE PROCEDURE get_pending_requests()
BEGIN
    SELECT
        ar.id AS request_id,
        ar.pet_id,
        p.name AS pet_name,
        u.name AS user_name,
        u.email AS user_email,
        ar.status,
        ar.created_at
    FROM adoption_requests ar
    JOIN pet p ON ar.pet_id = p.id
    JOIN users u ON ar.user_id = u.id
    WHERE ar.status = 'PENDING'
    ORDER BY ar.created_at ASC;
END$$

DELIMITER ;

-- ========================================
-- 5. VERIFICATION
-- ========================================

SHOW TABLES;
SHOW TRIGGERS;
SHOW PROCEDURE STATUS WHERE Db = 'pet_adoption_and_tracking_management_system_check';

SELECT 'Shelters:'          AS Table_Name, COUNT(*) AS Count FROM shelters
UNION ALL SELECT 'Admins:',         COUNT(*) FROM admins
UNION ALL SELECT 'Users:',          COUNT(*) FROM users
UNION ALL SELECT 'Pets:',           COUNT(*) FROM pet
UNION ALL SELECT 'Pending Pets:',   COUNT(*) FROM pets_pending
UNION ALL SELECT 'Adoption Requests:', COUNT(*) FROM adoption_requests
UNION ALL SELECT 'Tracking:',       COUNT(*) FROM tracking;

SELECT '✅ Database setup completed successfully!' AS Status;
