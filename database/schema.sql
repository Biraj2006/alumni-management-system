-- Online Alumni Data and Management System
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS alumni_management;
USE alumni_management;

-- Users table (core authentication)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'alumni', 'student') NOT NULL DEFAULT 'student',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alumni profiles (extended information)
CREATE TABLE alumni_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    batch VARCHAR(20),
    phone VARCHAR(20),
    company VARCHAR(100),
    designation VARCHAR(100),
    location VARCHAR(100),
    skills TEXT,
    linkedin VARCHAR(255),
    bio TEXT,
    available_for_mentorship BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student profiles
CREATE TABLE student_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    batch VARCHAR(20),
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentorship requests
CREATE TABLE mentorship_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    alumni_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Announcements
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    posted_by INT NOT NULL,
    target_audience ENUM('all', 'alumni', 'students') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Job posts by alumni
CREATE TABLE job_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    posted_by INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
    description TEXT NOT NULL,
    requirements TEXT,
    salary_range VARCHAR(50),
    application_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_approved) 
VALUES ('Admin', 'admin@college.edu', '$2b$10$rIC/Z5cQxK6Gy7NZ3s0XOeQh8t9VqgDv8j8HxMqJhB8M3K8G8K8G8', 'admin', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_alumni_batch ON alumni_profiles(batch);
CREATE INDEX idx_alumni_company ON alumni_profiles(company);
CREATE INDEX idx_alumni_location ON alumni_profiles(location);
CREATE INDEX idx_mentorship_status ON mentorship_requests(status);
CREATE INDEX idx_jobs_active ON job_posts(is_active);
