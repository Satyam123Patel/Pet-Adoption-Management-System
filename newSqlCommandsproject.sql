create database pet_adoption_and_tracking;
use pet_adoption_and_tracking;

CREATE TABLE adopters (
    adopter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shelters (
    shelter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(50),
    age INT,
    gender ENUM('M','F','U') DEFAULT 'U',
    status ENUM('available','pending','adopted') DEFAULT 'available',
    image_url VARCHAR(255),
    shelter_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (shelter_id) REFERENCES shelters(shelter_id)
);

CREATE TABLE adoption_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    adopter_id INT NOT NULL,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    decision_date DATETIME,
    admin_notes TEXT,

    FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    FOREIGN KEY (adopter_id) REFERENCES adopters(adopter_id)
);

CREATE TABLE tracking (
    track_id INT AUTO_INCREMENT PRIMARY KEY,
    pet_id INT NOT NULL,
    location VARCHAR(255),
    note TEXT,
    vet_visit_date DATE,
    vaccinated BOOLEAN DEFAULT FALSE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
);

INSERT INTO shelters (name, address, phone, email) VALUES
('Happy Paws Shelter', 'Plot 21, Green Street, Mumbai', '9876543210', 'contact@happypaws.org'),
('Animal Care Center', 'Sec 12, Baner, Pune', '9988776655', 'support@animalcare.in'),
('Rescue & Love Foundation', 'Park Road, Nagpur', '9090909090', 'info@rescueandlove.org');

INSERT INTO admins (name, email, password_hash) VALUES
('Rohit Sharma', 'rohit.admin@petsystem.com', '$2b$10$adminhash1'),
('Sneha Patel', 'sneha.admin@petsystem.com', '$2b$10$adminhash2');

INSERT INTO adopters (name, email, phone, address, password_hash) VALUES
('Utkarsh Phalphale', 'utkarsh@example.com', '9870011223', 'Nagpur, MH', '$2b$10$pass1'),
('Aditi Deshmukh', 'aditi.d@example.com', '9091234567', 'Pune, MH', '$2b$10$pass2'),
('Rahul Joshi', 'rahul.j@example.com', '9822334455', 'Mumbai, MH', '$2b$10$pass3'),
('Kavya Menon', 'kavya.m@example.com', '9877654321', 'Thane, MH', '$2b$10$pass4');

INSERT INTO pets (name, breed, age, gender, status, image_url, shelter_id) VALUES
('Bruno', 'Labrador', 3, 'M', 'available', 'img/bruno.jpg', 1),
('Lucy', 'Beagle', 2, 'F', 'available', 'img/lucy.jpg', 1),
('Shadow', 'German Shepherd', 4, 'M', 'pending', 'img/shadow.jpg', 1),

('Mia', 'Persian Cat', 1, 'F', 'available', 'img/mia.jpg', 2),
('Oscar', 'Siamese Cat', 5, 'M', 'available', 'img/oscar.jpg', 2),
('Luna', 'Indie Cat', 2, 'F', 'adopted', 'img/luna.jpg', 2),

('Rocky', 'Golden Retriever', 3, 'M', 'available', 'img/rocky.jpg', 3),
('Ginger', 'Pug', 6, 'F', 'available', 'img/ginger.jpg', 3),
('Simba', 'Indie Dog', 2, 'M', 'adopted', 'img/simba.jpg', 3),

('Snowy', 'Husky', 1, 'F', 'pending', 'img/snowy.jpg', 1),
('Chirpy', 'Parrot', 2, 'U', 'available', 'img/chirpy.jpg', 2),
('Bubbles', 'Rabbit', 1, 'U', 'available', 'img/bubbles.jpg', 3);

INSERT INTO adoption_requests (pet_id, adopter_id, status, request_date) VALUES
(3, 1, 'pending', NOW()),     -- Utkarsh requested Shadow
(10, 2, 'pending', NOW()),    -- Aditi requested Snowy
(6, 3, 'approved', NOW()),    -- Rahul adopted Luna
(9, 4, 'approved', NOW());    -- Kavya adopted Simba

INSERT INTO tracking (pet_id, location, note, vet_visit_date, vaccinated) VALUES
(6, 'Pune', 'Routine check-up', '2025-01-02', TRUE),
(6, 'Pune', 'Vaccination booster', '2025-02-15', TRUE),
(9, 'Thane', 'General health check', '2025-01-10', TRUE),
(9, 'Thane', 'Follow-up visit', '2025-02-20', TRUE);


DELIMITER $$

CREATE TRIGGER trg_update_pet_status_after_request
AFTER UPDATE ON adoption_requests
FOR EACH ROW
BEGIN
    -- When request is approved
    IF NEW.status = 'approved' THEN
        UPDATE pets
        SET status = 'adopted'
        WHERE pet_id = NEW.pet_id;

    -- When request is rejected
    ELSEIF NEW.status = 'rejected' THEN
        UPDATE pets
        SET status = 'available'
        WHERE pet_id = NEW.pet_id;

    -- Still pending (default)
    ELSEIF NEW.status = 'pending' THEN
        UPDATE pets
        SET status = 'pending'
        WHERE pet_id = NEW.pet_id;
    END IF;

END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_set_decision_date
BEFORE UPDATE ON adoption_requests
FOR EACH ROW
BEGIN
    IF NEW.status IN ('approved', 'rejected') AND OLD.status = 'pending' THEN
        SET NEW.decision_date = NOW();
    END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE submit_adoption_request(
    IN p_pet_id INT,
    IN p_adopter_id INT
)
BEGIN
    INSERT INTO adoption_requests (pet_id, adopter_id, status, request_date)
    VALUES (p_pet_id, p_adopter_id, 'pending', NOW());

    -- Mark pet as pending
    UPDATE pets
    SET status = 'pending'
    WHERE pet_id = p_pet_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE approve_adoption_request(
    IN p_request_id INT
)
BEGIN
    UPDATE adoption_requests
    SET status = 'approved'
    WHERE request_id = p_request_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE reject_adoption_request(
    IN p_request_id INT
)
BEGIN
    UPDATE adoption_requests
    SET status = 'rejected'
    WHERE request_id = p_request_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE get_pending_requests()
BEGIN
    SELECT ar.request_id, ar.pet_id, p.name AS pet_name,
           ar.adopter_id, a.name AS adopter_name,
           ar.request_date
    FROM adoption_requests ar
    JOIN pets p ON ar.pet_id = p.pet_id
    JOIN adopters a ON ar.adopter_id = a.adopter_id
    WHERE ar.status = 'pending'
    ORDER BY ar.request_date ASC;
END$$

DELIMITER ;



-- Check if you already have admin users:
SELECT * FROM admins;

-- If empty or you want another admin, run:
INSERT INTO admins (name, email, password_hash) 
VALUES ('Admin Name', 'admin@petadoption.com', '$2b$10$yourHashedPasswordHere');



-- 1. Add role column to admins table
ALTER TABLE admins ADD COLUMN role VARCHAR(20) DEFAULT 'ADMIN';


-- 2. Add role column to adopters table  
ALTER TABLE adopters ADD COLUMN role VARCHAR(20) DEFAULT 'USER';


-- Check if role column exists in adopters
DESCRIBE adopters;

-- Check if role column exists in admins
DESCRIBE admins;

-- See what data is already there
SELECT adopter_id, name, email, role FROM adopters;
SELECT admin_id, name, email, role FROM admins;

-- Update roles for existing records (if not already set)
UPDATE adopters SET role = 'USER' WHERE role IS NULL OR role = '';
UPDATE admins SET role = 'ADMIN' WHERE role IS NULL OR role = '';

-- Disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Now run your updates
UPDATE adopters SET role = 'USER' WHERE role IS NULL OR role = '';
UPDATE admins SET role = 'ADMIN' WHERE role IS NULL OR role = '';

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Use primary key in WHERE clause
UPDATE adopters 
SET role = 'USER' 
WHERE (role IS NULL OR role = '') 
AND adopter_id > 0;  -- This uses the primary key

UPDATE admins 
SET role = 'ADMIN' 
WHERE (role IS NULL OR role = '') 
AND admin_id > 0;  -- This uses the primary key

SET SQL_SAFE_UPDATES = 0;

-- 2. Update roles
UPDATE adopters SET role = 'USER' WHERE role IS NULL OR role = '';
UPDATE admins SET role = 'ADMIN' WHERE role IS NULL OR role = '';

-- Check if it has the right columns
SHOW COLUMNS FROM users;
SELECT COUNT(*) as total_users FROM users;
SELECT * FROM users LIMIT 5;

-- If users table is empty, populate it
INSERT INTO users (name, email, password, role)
SELECT name, email, password_hash, 'ADMIN' 
FROM admins;

INSERT INTO users (name, email, password, role)
SELECT name, email, password_hash, 'USER'
FROM adopters;

-- Make sure admin emails have ADMIN role
UPDATE users 
SET role = 'ADMIN' 
WHERE email LIKE '%admin%' OR email LIKE '%@petsystem.com';

-- Make sure others have USER role
UPDATE users 
SET role = 'USER' 
WHERE role IS NULL OR role = '' 
AND (email NOT LIKE '%admin%' AND email NOT LIKE '%@petsystem.com');

-- Check users with roles
SELECT id, name, email, role FROM users ORDER BY role DESC;

-- Test specific users
SELECT * FROM users WHERE email = 'rohit.admin@petsystem.com';
-- Should show role: 'ADMIN'

SELECT * FROM users WHERE email = 'utkarsh@example.com';
-- Should show role: 'USER'

-- 1. First check if users table has correct structure
DESCRIBE users;

-- 2. Clear table if needed
TRUNCATE TABLE users;

-- 3. Insert admins as ADMIN role
INSERT INTO users (name, email, password, role)
SELECT name, email, password_hash, 'ADMIN' 
FROM admins;

-- 4. Insert adopters as USER role
INSERT INTO users (name, email, password, role)
SELECT a.name, a.email, a.password_hash, 'USER'
FROM adopters a
WHERE a.email NOT IN (SELECT email FROM users);


-- 5. Verify - Should show users with roles
SELECT id, name, email, role FROM users;


-- Create a test admin with known password (password: 123456)
INSERT INTO users (name, email, password, role) 
VALUES ('Test Admin', 'admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y', 'ADMIN');

-- Create a test user with known password (password: 123456)  
INSERT INTO users (name, email, password, role) 
VALUES ('Test User', 'user@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y', 'USER');

CREATE TABLE otp_verification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);


ALTER TABLE otp_verification 
CHANGE expires_at expiry_time DATETIME;

SELECT * FROM otp_verification ORDER BY created_at DESC;

select * from otp_verification order by created_at desc;

SELECT * FROM otp_verification ORDER BY created_at DESC;

SELECT DATABASE();

USE pet_adoption_and_tracking;
SELECT * FROM otp_verification;

select * from users;


-- Reset passwords for existing admins to '123456'
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y' 
WHERE email IN ('rohit.admin@petsystem.com', 'sneha.admin@petsystem.com');

-- Verify
SELECT name, email, role FROM users WHERE role = 'ADMIN';

UPDATE users
SET role = 'ADMIN'
WHERE email = 'satyampatelkatni2003@gmail.com';

SELECT email, role FROM users WHERE email='satyampatelkatni2003@gmail.com';

UPDATE users
SET role = 'ADMIN'
WHERE email = 'satyampateler@gmail.com';


SELECT email, role FROM users WHERE email='satyampateler@gmail.com';

show tables;

select * from admins;

-- Add a test admin with password: admin123
INSERT INTO users (name, email, password, role) 
VALUES ('System Admin', 'admin@petadoption.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y', 'ADMIN');

-- Verify admin users
SELECT id, name, email, role FROM users WHERE role = 'ADMIN';

USE pet_adoption_and_tracking;

SELECT id, name, email, role FROM users;

SELECT * FROM users WHERE email = 'satyampatelkatni2003@gmail.com';

SELECT id, name, email, role FROM users;


show tables;

select * from admins;

UPDATE admins
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y'
WHERE email IN ('rohit.admin@petsystem.com',
                'sneha.admin@petsystem.com',
                'admin@petadoption.com');
                
INSERT INTO admins (name, email, password_hash, role)
VALUES (
    'System Admin',
    'admin@petsystem.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y',
    'ADMIN'
);


INSERT INTO users (name, email, password, role)
VALUES (
  'Satyam Patel',
  'satyampatelkatni2003@gmail.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y',
  'ADMIN'
);

SELECT id, name, email, role, password
FROM users
WHERE email = 'satyampatelkatni2003@gmail.com';

UPDATE admins
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y'
WHERE email IN (
    'rohit.admin@petsystem.com',
    'sneha.admin@petsystem.com',
    'admin@petadoption.com',
    'admin@petsystem.com'
);

SELECT email, password_hash FROM admins;

select * from admins;

SELECT email, password_hash, LENGTH(password_hash) as len FROM admins;

SELECT 
    email, 
    password_hash, 
    LENGTH(password_hash) as length,
    LEFT(password_hash, 30) as first_part,
    RIGHT(password_hash, 30) as last_part
FROM admins
WHERE email = 'admin@petadoption.com';

-- Disable safe updates
SET SQL_SAFE_UPDATES = 0;

-- Reset all admin passwords to "admin123"
UPDATE admins 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y';

-- Reset all admin user passwords to "admin123" 
UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y'
WHERE role = 'ADMIN';

-- Re-enable safe updates
SET SQL_SAFE_UPDATES = 1;

-- Verify
SELECT email, password_hash FROM admins;
SELECT email, password, role FROM users WHERE role = 'ADMIN';

-- Check exact hash with hex representation
SELECT 
    email,
    password_hash,
    LENGTH(password_hash) as length,
    HEX(password_hash) as hex_value,
    password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y' as exact_match
FROM admins;

-- Check for trailing spaces
SELECT 
    email,
    CONCAT('"', password_hash, '"') as quoted_hash,
    LENGTH(password_hash) as length,
    CHAR_LENGTH(password_hash) as char_length
FROM admins;

UPDATE admin
SET password_hash = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE email = 'admin@petadoption.com';

USE pet_adoption_and_tracking;

SELECT admin_id, name, email, password_hash FROM admins;

UPDATE admins
SET password_hash = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.';

UPDATE admins
SET password_hash = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE admin_id > 0;


SELECT 
  email,
  password_hash,
  LENGTH(password_hash),
  HEX(password_hash)
FROM admins
WHERE email = 'admin@petadoption.com';

SELECT id, name, email, password, role
FROM users
WHERE email = 'satyampatelkatni2003@gmail.com';

UPDATE adopters
SET password_hash = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.';


UPDATE users
SET password = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE id > 0;

SELECT id, email, LENGTH(password) FROM users;

show tables;

describe users;

INSERT INTO users (name, email, password, role)
SELECT name, email, password_hash, 'ADMIN'
FROM admins;

INSERT INTO users (name, email, password, role)
SELECT name, email, password_hash, 'USER'
FROM adopters
WHERE email NOT IN (SELECT email FROM users);

SELECT id, name, email, role FROM users;

UPDATE users
SET password = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE id > 0;


SELECT email, LENGTH(password) FROM users;


UPDATE users
SET password = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE email = 'utkarsh@example.com';

SELECT email, LENGTH(password)
FROM users
WHERE email = 'utkarsh@example.com';

show tables;
DESCRIBE users;

UPDATE users
SET password = '$2a$10$9nlbmOqEtEi8/JQYRpTmEuqq91wSYfcRY6x4KyETHdGStGmFv3Rm.'
WHERE id > 0;

SELECT email, LENGTH(password) FROM users;

SELECT email, password FROM users;

SET SQL_SAFE_UPDATES = 0;

UPDATE users 
SET password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y'
WHERE email IS NOT NULL;

SET SQL_SAFE_UPDATES = 1;

SELECT email, password FROM users;

SET SQL_SAFE_UPDATES = 0;

UPDATE users
SET password = '$2a$10$5sjG8zvtHyWDdNd0fhugPu76dnWnqqZGtWQBi07M0Q..6/Td6duQO';

SET SQL_SAFE_UPDATES = 1;
USE pet_adoption_and_tracking;

SELECT email, password FROM users;

select * from pets;

SET @a = 1;
select @a;

set @a = 5, @b = 6;
select @a + @b;


INSERT INTO pet 
(name, category, breed, age, gender, status, image_url)
VALUES

('Cat One','cat','indian',2,'F','available','1718906085691-433161642.jpeg'),

('Cat Two','cat','persian',1,'M','available','1718906182775-8078205.jpeg'),

('Cat Three','cat','street',3,'F','available','1718906255938-952635839.jpeg'),

('Dog Bruno','dog','labrador',2,'M','available','1718906386213-550689756.jpg'),

('Dog Rocky','dog','german shepherd',3,'M','available','1718906473944-923464963.jpg'),

('Dog Jimmy','dog','indian',1,'F','available','1718906531802-606585739.jpg'),

('Rabbit White','rabbit','normal',1,'F','available','1718906609733-573010075.jpg'),

('Rabbit Brown','rabbit','normal',2,'M','available','1718906666835-21470791.jpeg'),

('Rabbit Cute','rabbit','normal',1,'F','available','1718906728622-949628877.jpeg'),

('Fish Goldy','fish','goldfish',1,'M','available','1718906809727-756049182.jpg'),

('Fish Nemo','fish','clown',1,'M','available','1718906865077-840488064.jpg'),

('Fish Blue','fish','aquarium',1,'F','available','1718906922560-440283942.jpg'),

('Bird Sparrow','bird','sparrow',1,'M','available','1718906991558-261228787.jpg'),

('Bird Pigeon','bird','pigeon',1,'F','available','1718907035908-804370403.jpg'),

('Parrot Green','parrot','parrot',1,'M','available','1718907085550-787999544.jpg'),

('Cat Extra1','cat','indian',2,'F','available','1719079003718-487030209.jpg'),

('Cat Extra2','cat','persian',2,'M','available','1719079052044-631328966.jpg');

Select * from pet;

Delete from pet;

SET SQL_SAFE_UPDATES = 0;

Truncate Table pet;

SET SQL_SAFE_UPDATES = 1;

use pet_adoption_and_tracking;
SELECT * FROM adoption_requests;

select * from pets_pending;


USE pet_adoption_and_tracking;

-- 1. Drop the old adoption_requests table
DROP TABLE IF EXISTS adoption_requests;

-- 2. Create the NEW adoption_requests table
CREATE TABLE adoption_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pet_id BIGINT NOT NULL,
    pet_name VARCHAR(100),
    pet_breed VARCHAR(100),
    pet_age INT,
    pet_category VARCHAR(50),
    pet_image VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone_no VARCHAR(20),
    living_situation TEXT,
    previous_experience TEXT,
    family_composition TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (pet_id) REFERENCES pet(id) ON DELETE CASCADE
);

-- 3. Verify the new table structure
DESCRIBE adoption_requests;

-- 4. Check if it's empty (should be)
SELECT * FROM adoption_requests;

INSERT INTO adoption_requests 
(pet_id, pet_name, pet_breed, pet_age, pet_category, pet_image, email, phone_no, status)
VALUES 
(1, 'Bruno', 'Labrador', 3, 'dog', 'images/bruno.jpg', 'test@example.com', '1234567890', 'PENDING');

-- Drop old triggers that reference the old table structure
DROP TRIGGER IF EXISTS trg_update_pet_status_after_request;
DROP TRIGGER IF EXISTS trg_set_decision_date;

-- Drop old stored procedures
DROP PROCEDURE IF EXISTS submit_adoption_request;
DROP PROCEDURE IF EXISTS approve_adoption_request;
DROP PROCEDURE IF EXISTS reject_adoption_request;
DROP PROCEDURE IF EXISTS get_pending_requests;

DESCRIBE adoption_requests;

DESCRIBE pet;

SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'adoption_requests' 
AND CONSTRAINT_SCHEMA = 'pet_adoption_and_tracking';

SELECT * FROM adoption_requests ORDER BY created_at DESC LIMIT 5;

select * from users;

select * from adoption_requests;

DESCRIBE admins;

-- Insert admin user (password will be 'admin123')
INSERT INTO admins (name, email, password_hash, role) 
VALUES (
    'System Admin',
    'admin@petadoptionn.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN'
);

-- Verify it was inserted
SELECT * FROM admins;

USE pet_adoption_and_tracking;

-- 1. Update admin passwords to 'admin123'
UPDATE admins 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeKbB3XJk.F1Q4gFqJx4fJYF7J2qX4W9y'
WHERE admin_id > 0;

-- 2. Verify admins table has 'role' column
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'ADMIN';

select * from Admins;
Describe Admins;
-- 3. Verify pet table structure
DESCRIBE pet;

-- 4. If pets don't have correct status, update them
UPDATE pet SET status = 'available' WHERE status IS NULL OR status = '';

-- 5. Check adoption_requests table
SELECT * FROM adoption_requests ORDER BY created_at DESC LIMIT 10;

USE pet_adoption_and_tracking;

CREATE TABLE IF NOT EXISTS pets_pending (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT,
    gender CHAR(1),
    location VARCHAR(100),
    description TEXT,
    phone VARCHAR(20),
    image_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Verify table
DESCRIBE pets_pending;


USE pet_adoption_and_tracking;

SELECT * FROM pets_pending ORDER BY created_at DESC LIMIT 5;


USE pet_adoption_and_tracking;

SELECT admin_id, name, email, password_hash, role 
FROM admins 
WHERE email = 'admin@petadoption.com';




USE pet_adoption_and_tracking;

-- Update the admin password to admin123
UPDATE admins 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'admin@petadoption.com';

-- Verify it updated
SELECT 
    admin_id, 
    name, 
    email, 
    password_hash,
    LENGTH(password_hash) as hash_length
FROM admins 
WHERE email = 'admin@petadoption.com';


USE pet_adoption_and_tracking;

-- Delete ALL admins

SET SQL_SAFE_UPDATES = 0;


DELETE FROM admins;

SET SQL_SAFE_UPDATES = 1;

SELECT * FROM admins;


-- Insert fresh admin with CORRECT hash for password 'admin123'
INSERT INTO admins (name, email, password_hash, role, created_at)
VALUES (
    'System Admin',
    'admin@petadoption.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    NOW()
);

-- Verify the hash
SELECT 
    admin_id,
    name,
    email,
    password_hash,
    role,
    LENGTH(password_hash) as hash_length
FROM admins;


UPDATE admins
SET password_hash = '$2a$10$P3E6zxm0wihobGpab2/aBOJW3r3SDFX80acLo36gKIMZj9BpninOC'
WHERE email = 'admin@petadoption.com';



describe pets;
SELECT id, name, filename, image
FROM pets;


select * from pets;



-- Check what's currently stored
SELECT image_url FROM pets LIMIT 3;
SELECT image_path FROM pets_pending LIMIT 3;

SET SQL_SAFE_UPDATES = 0;

-- If you see full paths like "D:\...\image.jpg", fix them:
UPDATE pets 
SET image_url = SUBSTRING_INDEX(image_url, '\\', -1)
WHERE image_url LIKE '%\\%';

UPDATE pets_pending 
SET image_path = SUBSTRING_INDEX(image_path, '\\', -1)
WHERE image_path LIKE '%\\%';

SET SQL_SAFE_UPDATES = 1;


select image_url from pets;

