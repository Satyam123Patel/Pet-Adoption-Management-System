# Pet Adoption and Tracking Management System

A full-stack web application designed to connect prospective pet adopters with shelters and pet owners. The platform allows users to browse available pets, apply for pet adoptions, post pets for adoption, and track post-adoption status. Administrators have access to a dedicated management dashboard for approving requests, managing pet listings, and monitoring adoption histories.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Architecture](#database-architecture)
- [Prerequisites](#prerequisites)
- [Backend Installation and Setup](#backend-installation-and-setup)
- [Frontend Installation and Setup](#frontend-installation-and-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Application Workflow](#application-workflow)
- [Directory Structure](#directory-structure)
- [License](#license)

---

## Overview

The Pet Adoption and Tracking Management System provides a seamless experience for visitors, registered users, and administrators:
- Public visitors can immediately access the main website without forced login or sign-in walls, browsing available pets, reviewing services, and exploring adoption information.
- Protected actions (such as submitting an adoption application or posting a pet for rehoming) require authentication. Unauthenticated users are prompted to sign in or create an account when attempting these actions.
- Administrators possess role-based permissions to review submissions, update adoption statuses, and maintain records.

---

## Key Features

### 1. Public Visitor Access
- Instant website access: The homepage, services overview, pet catalog, and contact information load directly upon opening the website.
- Categorized pet browsing: Filter pets by category including Dogs, Cats, Rabbits, Birds, and Fish.
- Transparent workflow: Clear information on adoption benefits, guidelines, and shelter partner contacts.

### 2. User Authentication and Account Security
- Secure registration with email-based OTP (One-Time Password) verification.
- Password hashing using BCrypt.
- Stateless authentication powered by JSON Web Tokens (JWT).
- User profile management for authenticated users.

### 3. Pet Adoption Application
- Prospective adopters can view detailed pet profiles (breed, age, gender, category, images).
- Protected application form collects living situation, previous pet experience, and household composition.
- If a guest initiates adoption or submits the form, a sign-in/sign-up dialog prompts them to authenticate.

### 4. Post a Pet for Adoption
- Users can list pets for rehoming by uploading images, specifying location, breed, age, and details.
- Submissions enter a pending queue for administrative review before public listing.
- Guests attempting to submit are prompted to log in or register before completing their post.

### 5. Admin Management Panel
- Centralized dashboard displaying adoption metrics and pet inventory.
- Pet management (add, edit, update status).
- Review and approval/rejection of user-submitted pending pets.
- Review and processing of adoption applications.
- Tracking management for adopted pets (medical records, vaccination history, location updates).
- Comprehensive adoption history logs.

---

## Technology Stack

### Frontend
- Library: React 19
- Build Tool: Vite
- Routing: React Router v7
- State Management: React Context API and Hooks
- UI Framework: Bootstrap 5
- Icons: FontAwesome Icons
- Charts: Recharts
- HTTP Client: Fetch API / Axios

### Backend
- Framework: Spring Boot 3
- Language: Java 17
- Security: Spring Security with JWT and BCrypt
- ORM / Persistence: Spring Data JPA, Hibernate
- Database: MySQL
- Cloud Storage: Cloudinary (pet media and image hosting)
- Email Service: SendGrid API (OTP email delivery)

---

## System Architecture

The application is structured into decoupled frontend and backend services:
- The React single-page application handles view rendering, routing, client-side validation, and state preservation.
- The Spring Boot backend exposes RESTful endpoints, enforces role-based access control (ROLE_USER, ROLE_ADMIN), manages file uploads, and coordinates with external services (Cloudinary, SendGrid).
- MySQL persists users, pets, shelters, adoption requests, OTP verifications, and tracking records.

---

## Database Architecture

The schema is defined in `Mysql.sql` under the database `pet_adoption_and_tracking_management_system_check`.

### Core Tables
- `users`: Registered adopters (id, name, email, password, role, created_at).
- `admins`: Administrative accounts (admin_id, name, email, password_hash, role, created_at).
- `shelters`: Partner shelters (shelter_id, name, address, phone, email, created_at).
- `pet`: Approved pets visible to the public (id, name, category, breed, age, gender, status, image_url, shelter_id).
- `pets_pending`: User-submitted pets awaiting admin approval (id, name, email, category, breed, age, gender, location, description, phone, image_path, status).
- `adoption_requests`: Submitted adoption applications (id, user_id, pet_id, living_situation, previous_experience, family_composition, status, timestamps).
- `otp_verification`: Stores OTP tokens and expiry times for registration verification.
- `tracking`: Post-adoption tracking records (track_id, pet_id, location, note, vet_visit_date, vaccinated, updated_at).

### Triggers and Procedures
- `trg_update_pet_status_after_request`: Automatically updates pet status to 'adopted', 'available', or 'pending' when an adoption request status changes.
- `trg_set_decision_date`: Sets decision timestamps upon adoption status updates.
- Stored Procedures: `submit_adoption_request`, `approve_adoption_request`, `reject_adoption_request`, `get_pending_requests`.

---

## Prerequisites

Ensure the following tools are installed on your workstation:
- Java Development Kit (JDK) 17 or higher
- Node.js (v18.x or higher) and npm (v9.x or higher)
- MySQL Server 8.0 or higher
- Git

---

## Backend Installation and Setup

### 1. Database Initialization
1. Start your local MySQL service.
2. Open a MySQL terminal or GUI client (such as MySQL Workbench).
3. Execute the SQL setup script located at the root of the repository:
   ```sql
   SOURCE Mysql.sql;
   ```
   Or import via command line:
   ```bash
   mysql -u root -p < Mysql.sql
   ```

### 2. Configure Environment Variables
Configure the required environment variables in your operating system or create an `application-local.properties` file in `backend/src/main/resources/`.

Key properties expected by `backend/src/main/resources/application.properties`:
```properties
DB_URL=jdbc:mysql://localhost:3306/pet_adoption_and_tracking_management_system_check?useSSL=false&serverTimezone=UTC
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

SERVER_PORT=8080
CORS_ORIGIN=http://localhost:5173

JWT_SECRET=your_jwt_secret_key_minimum_256_bits_long

SENDGRID_API_KEY=your_sendgrid_api_key
MAIL_USERNAME=your_verified_sender_email@domain.com

FILE_UPLOAD_DIR=./uploads

ADMIN_EMAIL=admin@pawpals.com
ADMIN_PASSWORD=adminPassword123
ADMIN_NAME=SuperAdmin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Backend Application
Navigate to the backend directory and launch the application:

```bash
cd backend
./mvnw clean spring-boot:run
```

On Windows (Command Prompt / PowerShell):
```cmd
cd backend
mvnw.cmd clean spring-boot:run
```

The server will start on port 8080 (or the specified `SERVER_PORT`).

---

## Frontend Installation and Setup

### 1. Navigate to the Frontend Directory
```bash
cd frontend
```

### 2. Configure Environment Variables
Inspect or update `frontend/.env` with the URL of your backend:

```env
VITE_API_URL=http://localhost:8080
```
*(For deployed staging/production, configure the remote backend URL accordingly).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend application will start locally at `http://localhost:5173`.

### 5. Production Build
To create an optimized production build:
```bash
npm run build
```
Build output is saved to the `dist/` directory.

---

## Environment Variables

| Variable Name | Component | Description |
|---|---|---|
| `VITE_API_URL` | Frontend | Base URL of the backend REST API |
| `DB_URL` | Backend | JDBC connection string for MySQL |
| `DB_USERNAME` | Backend | Database user name |
| `DB_PASSWORD` | Backend | Database user password |
| `SERVER_PORT` | Backend | Port for Spring Boot server (Default: 8080) |
| `CORS_ORIGIN` | Backend | Allowed CORS origins (e.g. `http://localhost:5173`) |
| `JWT_SECRET` | Backend | Secret string used for signing authentication tokens |
| `SENDGRID_API_KEY` | Backend | SendGrid mail API key for sending registration OTPs |
| `MAIL_USERNAME` | Backend | Sender email address for outgoing messages |
| `FILE_UPLOAD_DIR` | Backend | Local storage path for uploaded documents/files |
| `ADMIN_EMAIL` | Backend | Administrative login identifier |
| `ADMIN_PASSWORD` | Backend | Administrative initial password |
| `ADMIN_NAME` | Backend | Administrative account display name |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary cloud identifier |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary public API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary private API secret |

---

## API Documentation

### Public Endpoints
- `GET /pets` - Retrieve list of available pets
- `GET /pets/{id}` - Retrieve details for a specific pet
- `POST /pets/submit` - Submit a pet for adoption (creates pending pet record with image upload)
- `POST /adoptions/{petId}` - Submit an adoption application for a pet
- `POST /api/auth/login` - Authenticate user credentials and return JWT token
- `POST /api/auth/signup` - Register a new user with verified OTP
- `POST /api/otp/send` - Generate and send an OTP code to a user email
- `POST /api/otp/verify` - Verify submitted OTP code
- `POST /api/admin/login` - Authenticate admin credentials and return admin token

### Authenticated User Endpoints
- `PUT /api/user/update` - Update account details (Requires Bearer Token, ROLE_USER)
- `GET /adoptions/user/{userId}` - Retrieve adoption requests for a user
- `GET /adoptions/status/{requestId}` - Check status of an adoption request

### Administrator Endpoints (Requires Bearer Token, ROLE_ADMIN)
- `POST /api/admin/login` - Admin login endpoint
- `GET /api/admin/pets/all` - List all pets in database
- `GET /api/admin/pets/available` - List available pets
- `GET /api/admin/pets/adopted` - List adopted pets
- `GET /api/admin/pets/pending` - List pending pet submissions awaiting review
- `POST /api/admin/pets/add` - Add new pet listing with image upload
- `PUT /api/admin/pets/{id}` - Update pet listing
- `DELETE /api/admin/pets/{id}` - Delete pet listing (also mapped to `/api/admin/pets/adopted/{id}`)
- `POST /api/admin/pets/approve/{id}` - Approve pending pet submission and publish to available pets
- `POST /api/admin/pets/reject/{id}` - Reject pending pet submission
- `GET /api/admin/adoptions/pending` - List pending adoption applications
- `PUT /api/admin/adoptions/{id}/approve` - Approve adoption application and notify adopter by email
- `PUT /api/admin/adoptions/{id}/reject` - Reject adoption application
- `GET /api/admin/tracking/adopted-pets` - List all adopted pets eligible for post-adoption tracking
- `GET /api/admin/tracking/history/{petId}` - Get tracking and medical history for an adopted pet
- `POST /api/admin/tracking/add` - Add new medical/tracking milestone record for a pet
- `PUT /api/admin/tracking/update/{trackId}` - Update tracking milestone record
- `DELETE /api/admin/tracking/delete/{trackId}` - Delete tracking record
- `GET /api/admin/stats/users` - Get total registered users metric
- `GET /api/admin/stats/pets` - Get total pets metric
- `GET /api/admin/stats/requests` - Get pending adoption requests count
- `GET /api/admin/stats/adopted` - Get total adopted pets metric
- `GET /api/admin/stats/pet-types` - Get pet distribution by category for charts
- `GET /api/admin/stats/monthly-adoptions` - Get monthly adoption trends data for charts

---

## Application Workflow

1. Site Discovery:
   - Visitors open `http://localhost:5173/` and arrive directly on the Home page.
   - Visitors can navigate between Home, Services, Pets, and Contact Us without any sign-in prompt.
2. Sign In and Registration:
   - A dedicated "Sign In / Sign Up" button is available in the top navigation bar.
   - Registration verifies email through an OTP flow before account activation.
3. Adoption Process:
   - Users browse available pets on the Pets page.
   - Clicking "Show Interest" opens the adoption modal if authenticated.
   - If the user is unauthenticated, a dialog prompts them to Sign In or Sign Up before proceeding.
4. Pet Rehoming Process:
   - Users access the "Post a Pet for Adoption" form in Services.
   - Submitting the form as an unauthenticated guest prompts the user to Sign In or Sign Up.
   - Submissions are routed to the Admin Pending Pets queue.
5. Administrative Review:
   - Administrators log in through the `/admin` portal.
   - The dashboard provides administrative controls to approve or reject pending requests and maintain tracking history.

---

## Directory Structure

```
Pet-Adoption-Management-System/
├── Mysql.sql                               # Database creation, schema, seeds, triggers
├── README.md                               # Project documentation
├── backend/                                # Spring Boot Java backend
│   ├── pom.xml                             # Maven build configuration
│   └── src/
│       └── main/
│           ├── java/com/petadoption/
│           │   ├── BackendApplication.java # Spring Boot entry point
│           │   ├── config/                 # Security, CORS, Cloudinary configs
│           │   ├── controller/             # REST controllers
│           │   ├── dto/                    # Data Transfer Objects
│           │   ├── entity/                 # JPA Entities
│           │   ├── repository/             # Spring Data repositories
│           │   ├── security/               # JWT filters and token provider
│           │   └── service/                # Business logic services
│           └── resources/
│               ├── application.properties  # Backend configurations
│               └── static/images/          # Seed image assets
└── frontend/                               # React / Vite frontend
    ├── index.html                          # HTML entry template
    ├── package.json                        # Dependencies and scripts
    ├── vite.config.js                      # Vite bundler configuration
    ├── .env                                # Frontend environment variables
    └── src/
        ├── App.jsx                         # Main routing configuration
        ├── main.jsx                        # React root entry point
        ├── assets/                         # Static images and asset loaders
        ├── Context/                        # Auth and Admin Context providers
        ├── hooks/                          # Custom React hooks (useAuth, useLogin, etc.)
        └── components/
            ├── Layout.jsx                  # Header/Footer layout wrapper
            ├── Navbar.jsx                  # Top navigation with auth actions
            ├── Footer.jsx                  # Site footer
            ├── ProtectedRoute.jsx          # Route authentication guard
            ├── Home/                       # Home page sections and cards
            ├── Services/                   # Services and Post Pet section
            ├── Pets/                       # Pet gallery and viewer cards
            ├── AdoptForm/                  # Pet adoption application form
            ├── Auth/                       # User Login & Sign Up with OTP
            ├── Profile/                    # User account management
            ├── Contact/                    # Contact information
            ├── FourZeroFour/               # Not found 404 handler
            └── AdminPanel/                 # Admin dashboard and sub-views
```

---

## License

This project is licensed under the MIT License.