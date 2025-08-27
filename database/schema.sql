-- NTLP Conference 2025 - Database Schema
-- Payment and Sponsorship System

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ntlp_conference;
USE ntlp_conference;

-- Existing registrations table (update with payment fields)
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  organization VARCHAR(255),
  position VARCHAR(255),
  district VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Uganda',
  registrationType ENUM('undergrad', 'grad', 'local', 'intl', 'online') NOT NULL,
  specialRequirements TEXT,
  dietary_requirements TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  payment_amount DECIMAL(10,2) DEFAULT 0,
  payment_currency VARCHAR(3) DEFAULT 'UGX',
  payment_reference VARCHAR(255),
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_registration_type (registrationType)
);

-- Contacts table (existing)
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in-progress', 'resolved', 'pending') DEFAULT 'new',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- Abstract submissions table (existing)
CREATE TABLE IF NOT EXISTS abstracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  authors VARCHAR(500) NOT NULL,
  email VARCHAR(255) NOT NULL,
  institution VARCHAR(255),
  category ENUM('research', 'case-study', 'review', 'policy') NOT NULL,
  subcategory VARCHAR(500),
  keywords TEXT,
  abstract TEXT NOT NULL,
  fileName VARCHAR(255),
  filePath VARCHAR(1024),
  fileSize INT,
  status ENUM('pending', 'under-review', 'accepted', 'rejected') DEFAULT 'pending',
  reviewComments TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- New Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_id VARCHAR(255) NOT NULL UNIQUE,
  payment_type ENUM('registration', 'sponsorship') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  registration_id INT NULL,
  sponsorship_id INT NULL,
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  gateway_response JSON,
  form_data JSON COMMENT 'Stores form data temporarily until payment is verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_reference (reference_id),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_payment_type (payment_type),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_payments_form_data (payment_type, status),
  
  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL,
  FOREIGN KEY (sponsorship_id) REFERENCES sponsorships(id) ON DELETE SET NULL
);

-- New Sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  package_type ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  website VARCHAR(255),
  industry VARCHAR(255),
  special_requirements TEXT,
  status ENUM('pending', 'confirmed', 'rejected', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  payment_reference VARCHAR(255),
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_company (company_name),
  INDEX idx_package_type (package_type),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
);

-- Payment logs table for audit trail
CREATE TABLE IF NOT EXISTS payment_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_payment_id (payment_id),
  INDEX idx_action (action),
  
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- Admin users table (for admin authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Default admin user (password: admin123 - change in production)
INSERT IGNORE INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@idi.co.ug', '$2b$10$8K1p/a5XsT3iDmQGPEKaJeKm6YhzZx7K7qXh9yV6WYp1I9Rz8j3Q2', 'System Administrator', 'super_admin');

-- Conference settings table
CREATE TABLE IF NOT EXISTS conference_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_key (setting_key)
);

-- Default conference settings
INSERT IGNORE INTO conference_settings (setting_key, setting_value, description) VALUES
('conference_name', 'NTLP Conference 2025', 'Conference name'),
('conference_date_start', '2025-03-15', 'Conference start date'),
('conference_date_end', '2025-03-19', 'Conference end date'),
('registration_open', 'true', 'Whether registration is open'),
('sponsorship_open', 'true', 'Whether sponsorship applications are open'),
('max_registrations', '1000', 'Maximum number of registrations'),
('contact_email', 'conference@idi.co.ug', 'Conference contact email'),
('flutterwave_public_key', '', 'Flutterwave public key for frontend'),
('early_bird_deadline', '2025-02-15', 'Early bird registration deadline');

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_key VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  variables JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_key (template_key)
);

-- Default email templates
INSERT IGNORE INTO email_templates (template_key, subject, body_html, body_text) VALUES
('registration_confirmation', 'NTLP Conference 2025 - Registration Confirmation', 
 '<h1>Registration Confirmed</h1><p>Thank you for registering for the NTLP Conference 2025.</p>', 
 'Registration Confirmed\n\nThank you for registering for the NTLP Conference 2025.'),
('payment_confirmation', 'NTLP Conference 2025 - Payment Confirmation', 
 '<h1>Payment Confirmed</h1><p>Your payment has been successfully processed.</p>', 
 'Payment Confirmed\n\nYour payment has been successfully processed.'),
('sponsorship_confirmation', 'NTLP Conference 2025 - Sponsorship Application Received', 
 '<h1>Sponsorship Application Received</h1><p>Thank you for your interest in sponsoring the NTLP Conference 2025.</p>', 
 'Sponsorship Application Received\n\nThank you for your interest in sponsoring the NTLP Conference 2025.');

-- Create views for reporting
CREATE OR REPLACE VIEW registration_summary AS
SELECT 
  r.registrationType,
  COUNT(*) as total_registrations,
  SUM(CASE WHEN r.payment_status = 'completed' THEN 1 ELSE 0 END) as paid_registrations,
  SUM(CASE WHEN r.payment_status = 'completed' THEN r.payment_amount ELSE 0 END) as total_revenue,
  AVG(CASE WHEN r.payment_status = 'completed' THEN r.payment_amount ELSE NULL END) as avg_payment
FROM registrations r
GROUP BY r.registrationType;

CREATE OR REPLACE VIEW sponsorship_summary AS
SELECT 
  s.package_type,
  COUNT(*) as total_applications,
  SUM(CASE WHEN s.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_sponsors,
  SUM(CASE WHEN s.payment_status = 'completed' THEN s.amount ELSE 0 END) as total_revenue
FROM sponsorships s
GROUP BY s.package_type;

CREATE OR REPLACE VIEW payment_summary AS
SELECT 
  p.payment_type,
  p.currency,
  COUNT(*) as total_payments,
  SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
  SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as total_completed_amount,
  SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END) as total_pending_amount
FROM payments p
GROUP BY p.payment_type, p.currency;
