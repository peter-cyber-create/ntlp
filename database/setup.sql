-- Setup script for Conference 2025 Database
-- MySQL/MariaDB Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS conf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'conf_user'@'localhost' IDENTIFIED BY 'toor';
GRANT ALL PRIVILEGES ON conf.* TO 'conf_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE conf;

-- Table: registrations
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  organization VARCHAR(255),
  position VARCHAR(255),
  district VARCHAR(100),
  registrationType ENUM('early-bird', 'regular', 'student') NOT NULL DEFAULT 'regular',
  specialRequirements TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (createdAt)
);

-- Table: abstracts
CREATE TABLE IF NOT EXISTS abstracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  authors TEXT NOT NULL,
  institution VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  category ENUM('research', 'case-study', 'review', 'policy') NOT NULL,
  keywords TEXT,
  abstract TEXT NOT NULL,
  fileName VARCHAR(255) NOT NULL,
  filePath VARCHAR(500) NOT NULL,
  fileSize INT,
  status ENUM('pending', 'under-review', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
  reviewComments TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (createdAt)
);

-- Table: contacts
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in-progress', 'resolved', 'closed') NOT NULL DEFAULT 'new',
  adminNotes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (createdAt)
);

-- Table: speakers (for future use)
CREATE TABLE IF NOT EXISTS speakers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  organization VARCHAR(255),
  bio TEXT,
  expertise JSON,
  imageUrl VARCHAR(500),
  contactEmail VARCHAR(255),
  linkedinUrl VARCHAR(500),
  twitterUrl VARCHAR(500),
  sessionTitle VARCHAR(500),
  sessionDescription TEXT,
  isKeynote BOOLEAN DEFAULT FALSE,
  status ENUM('invited', 'confirmed', 'cancelled') NOT NULL DEFAULT 'invited',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_keynote (isKeynote)
);

-- Table: partners (for future use)
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('sponsor', 'partner', 'media', 'supporter') NOT NULL,
  level ENUM('platinum', 'gold', 'silver', 'bronze', 'supporter') NOT NULL,
  logoUrl VARCHAR(500),
  websiteUrl VARCHAR(500),
  description TEXT,
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_level (level),
  INDEX idx_active (isActive),
  INDEX idx_order (displayOrder)
);

-- Create admin user table (for future authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'moderator', 'viewer') NOT NULL DEFAULT 'viewer',
  isActive BOOLEAN DEFAULT TRUE,
  lastLoginAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (isActive)
);

-- Insert some sample data for testing
INSERT IGNORE INTO contacts (name, email, subject, message, status) VALUES
('John Doe', 'john@example.com', 'Conference Inquiry', 'I would like to know more about the conference schedule.', 'new'),
('Jane Smith', 'jane@example.com', 'Registration Question', 'Can I register as a student participant?', 'new'),
('Dr. Brown', 'brown@university.edu', 'Speaker Application', 'I am interested in presenting my research on communicable diseases.', 'in-progress');

-- Show all tables
SHOW TABLES;

-- Show user info
SELECT 'Database setup completed successfully!' AS status;
