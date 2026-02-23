-- Alumni Management System Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS alumni_management;
USE alumni_management;

-- Users table (for all user types)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'alumni', 'student') NOT NULL DEFAULT 'student',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alumni profiles table
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    batch VARCHAR(10),
    phone VARCHAR(20),
    company VARCHAR(100),
    designation VARCHAR(100),
    location VARCHAR(100),
    skills TEXT,
    linkedin VARCHAR(255),
    bio TEXT,
    is_mentor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    batch VARCHAR(10),
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mentorship requests table
CREATE TABLE IF NOT EXISTS mentorship_requests (
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

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_audience ENUM('all', 'alumni', 'students') DEFAULT 'all',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alumni_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    requirements TEXT,
    job_type ENUM('full-time', 'part-time', 'internship', 'contract') DEFAULT 'full-time',
    application_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumni_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, is_approved) 
VALUES ('Admin', 'admin@college.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_alumni_batch ON alumni_profiles(batch);
CREATE INDEX idx_alumni_company ON alumni_profiles(company);
CREATE INDEX idx_mentorship_status ON mentorship_requests(status);
CREATE INDEX idx_jobs_active ON job_postings(is_active);
