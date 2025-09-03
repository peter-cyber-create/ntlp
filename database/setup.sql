-- Complete Database Setup for NTLP Conference Frontend & Backend
-- MySQL/MariaDB Database Setup and Migration
-- This script creates the database, user, and all tables with the latest schema
-- Includes backend API configurations and production-ready settings

-- ============================================================================
-- SECTION 1: DATABASE AND USER SETUP
-- ============================================================================

-- Create database with proper charset for international characters
CREATE DATABASE IF NOT EXISTS conf 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create users for different environments
CREATE USER IF NOT EXISTS 'conf_user'@'localhost' IDENTIFIED BY 'toor';
CREATE USER IF NOT EXISTS 'conf_user'@'%' IDENTIFIED BY 'toor';
CREATE USER IF NOT EXISTS 'conf_admin'@'localhost' IDENTIFIED BY 'admin_toor_2025';

-- Grant appropriate privileges
GRANT ALL PRIVILEGES ON conf.* TO 'conf_user'@'localhost';
GRANT ALL PRIVILEGES ON conf.* TO 'conf_user'@'%';
GRANT ALL PRIVILEGES ON conf.* TO 'conf_admin'@'localhost';

-- Create read-only user for analytics/reporting
CREATE USER IF NOT EXISTS 'conf_readonly'@'localhost' IDENTIFIED BY 'readonly_2025';
GRANT SELECT ON conf.* TO 'conf_readonly'@'localhost';

FLUSH PRIVILEGES;

-- Use the database
USE conf;

-- ============================================================================
-- SECTION 2: CORE APPLICATION TABLES
-- ============================================================================

-- Table: registrations (Enhanced with backend integration fields)
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
  registrationType ENUM('undergrad', 'grad', 'local', 'intl', 'online') NOT NULL DEFAULT 'local',
  specialRequirements TEXT,
  dietary_requirements TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Payment integration fields
  payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_amount DECIMAL(10, 2),
  payment_currency VARCHAR(3) DEFAULT 'UGX',
  payment_reference VARCHAR(255),
  payment_method ENUM('mobile_money', 'bank_transfer', 'card', 'cash', 'waiver') DEFAULT 'mobile_money',
  payment_phone VARCHAR(20),
  payment_provider VARCHAR(50), -- MTN, Airtel, Visa, etc.
  transaction_id VARCHAR(255),
  
  -- Registration status and workflow
  status ENUM('pending', 'confirmed', 'cancelled', 'waitlist') NOT NULL DEFAULT 'pending',
  confirmation_code VARCHAR(50) UNIQUE,
  qr_code TEXT, -- For QR code generation
  
  -- Event participation tracking
  checked_in BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP NULL,
  badge_printed BOOLEAN DEFAULT FALSE,
  
  -- Communication tracking
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  reminder_email_sent BOOLEAN DEFAULT FALSE,
  
  -- Backend integration fields
  api_source VARCHAR(50) DEFAULT 'web_form',
  user_agent TEXT,
  ip_address VARCHAR(45),
  session_id VARCHAR(255),
  
  -- Timestamps
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_registration_type (registrationType),
  INDEX idx_is_verified (is_verified),
  INDEX idx_created (createdAt),
  INDEX idx_confirmation_code (confirmation_code),
  INDEX idx_payment_reference (payment_reference),
  INDEX idx_country (country),
  INDEX idx_checked_in (checked_in)
);

-- Table: abstracts (Enhanced for academic workflow)
CREATE TABLE IF NOT EXISTS abstracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  authors TEXT NOT NULL,
  corresponding_author VARCHAR(255),
  institution VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  
  -- Abstract categorization
  category ENUM('research', 'case-study', 'review', 'policy', 'innovation', 'poster') NOT NULL,
  subcategory VARCHAR(100),
  keywords TEXT,
  abstract TEXT NOT NULL,
  
  -- File management
  fileName VARCHAR(255) NOT NULL,
  filePath VARCHAR(500) NOT NULL,
  fileSize INT,
  fileType VARCHAR(20) DEFAULT 'pdf',
  originalFileName VARCHAR(255),
  
  -- Review workflow
  status ENUM('pending', 'under-review', 'revision-required', 'accepted', 'rejected', 'withdrawn') NOT NULL DEFAULT 'pending',
  reviewComments TEXT,
  reviewer_id INT,
  review_score DECIMAL(3,2), -- Score out of 5.00
  presentation_type ENUM('oral', 'poster', 'workshop') DEFAULT 'poster',
  
  -- Session assignment
  session_id INT,
  presentation_time DATETIME,
  presentation_duration INT DEFAULT 15, -- minutes
  
  -- Backend tracking
  download_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_created (createdAt),
  INDEX idx_reviewer (reviewer_id),
  INDEX idx_session (session_id),
  INDEX idx_presentation_type (presentation_type)
);

-- Table: contacts (Enhanced for CRM functionality)
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(255),
  position VARCHAR(255),
  country VARCHAR(100),
  
  -- Contact details
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  contact_type ENUM('inquiry', 'support', 'partnership', 'sponsorship', 'media', 'speaker') DEFAULT 'inquiry',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  
  -- Status tracking
  status ENUM('new', 'in-progress', 'resolved', 'closed', 'escalated') NOT NULL DEFAULT 'new',
  assigned_to VARCHAR(100),
  adminNotes TEXT,
  internal_notes TEXT,
  
  -- Response tracking
  response_required BOOLEAN DEFAULT TRUE,
  response_deadline DATETIME,
  last_response_at TIMESTAMP NULL,
  response_count INT DEFAULT 0,
  
  -- Backend integration
  source ENUM('web_form', 'api', 'email', 'phone', 'social_media') DEFAULT 'web_form',
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer VARCHAR(500),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created (createdAt),
  INDEX idx_contact_type (contact_type),
  INDEX idx_priority (priority),
  INDEX idx_assigned_to (assigned_to),
  INDEX idx_response_required (response_required)
);

-- ============================================================================
-- SECTION 3: CONFERENCE MANAGEMENT TABLES
-- ============================================================================

-- Table: speakers (Enhanced for speaker management)
CREATE TABLE IF NOT EXISTS speakers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  organization VARCHAR(255),
  bio TEXT,
  expertise JSON,
  
  -- Contact information
  contactEmail VARCHAR(255),
  phone VARCHAR(20),
  linkedinUrl VARCHAR(500),
  twitterUrl VARCHAR(500),
  websiteUrl VARCHAR(500),
  
  -- Media
  imageUrl VARCHAR(500),
  cv_url VARCHAR(500),
  
  -- Session details
  sessionTitle VARCHAR(500),
  sessionDescription TEXT,
  sessionDuration INT DEFAULT 45, -- minutes
  sessionType ENUM('keynote', 'plenary', 'panel', 'workshop', 'presentation') DEFAULT 'presentation',
  isKeynote BOOLEAN DEFAULT FALSE,
  
  -- Logistics
  travel_required BOOLEAN DEFAULT FALSE,
  accommodation_required BOOLEAN DEFAULT FALSE,
  av_requirements TEXT,
  dietary_requirements TEXT,
  
  -- Status and workflow
  status ENUM('invited', 'confirmed', 'declined', 'cancelled', 'completed') NOT NULL DEFAULT 'invited',
  invitation_sent_at TIMESTAMP NULL,
  confirmation_received_at TIMESTAMP NULL,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_status (status),
  INDEX idx_keynote (isKeynote),
  INDEX idx_session_type (sessionType),
  INDEX idx_email (contactEmail)
);

-- Table: sessions (Conference session management)
CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  session_type ENUM('keynote', 'plenary', 'panel', 'workshop', 'presentation', 'poster', 'break', 'networking') NOT NULL,
  
  -- Timing
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration INT NOT NULL, -- minutes
  day_number INT NOT NULL, -- 1, 2, 3 etc.
  
  -- Location
  venue VARCHAR(255),
  room VARCHAR(100),
  capacity INT,
  
  -- Session details
  moderator VARCHAR(255),
  track VARCHAR(100), -- Research, Policy, Innovation, etc.
  target_audience TEXT,
  learning_objectives TEXT,
  
  -- Resources
  materials_url VARCHAR(500),
  recording_url VARCHAR(500),
  slides_url VARCHAR(500),
  
  -- Status
  status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
  is_virtual BOOLEAN DEFAULT FALSE,
  meeting_link VARCHAR(500),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_start_time (start_time),
  INDEX idx_day_number (day_number),
  INDEX idx_session_type (session_type),
  INDEX idx_track (track),
  INDEX idx_status (status)
);

-- Table: partners (Enhanced partnership management)
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('sponsor', 'partner', 'media', 'supporter', 'vendor', 'academic') NOT NULL,
  level ENUM('platinum', 'gold', 'silver', 'bronze', 'supporter', 'in-kind') NOT NULL,
  
  -- Contact information
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  
  -- Partnership details
  contribution_amount DECIMAL(12, 2),
  contribution_currency VARCHAR(3) DEFAULT 'UGX',
  contribution_type ENUM('cash', 'in-kind', 'services', 'venue', 'media') DEFAULT 'cash',
  benefits TEXT, -- What they get in return
  
  -- Media and branding
  logoUrl VARCHAR(500),
  websiteUrl VARCHAR(500),
  description TEXT,
  tagline VARCHAR(255),
  
  -- Display settings
  displayOrder INT DEFAULT 0,
  show_on_website BOOLEAN DEFAULT TRUE,
  show_in_materials BOOLEAN DEFAULT TRUE,
  logo_placement ENUM('main', 'sidebar', 'footer', 'materials') DEFAULT 'main',
  
  -- Status
  isActive BOOLEAN DEFAULT TRUE,
  contract_signed BOOLEAN DEFAULT FALSE,
  payment_received BOOLEAN DEFAULT FALSE,
  
  -- Documents
  contract_url VARCHAR(500),
  invoice_url VARCHAR(500),
  
  -- Timestamps
  partnership_start_date DATE,
  partnership_end_date DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_type (type),
  INDEX idx_level (level),
  INDEX idx_active (isActive),
  INDEX idx_order (displayOrder),
  INDEX idx_show_website (show_on_website)
);

-- ============================================================================
-- SECTION 4: BACKEND SYSTEM TABLES
-- ============================================================================

-- Table: admin_users (Enhanced admin management)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  
  -- User details
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(20),
  
  -- Permissions and roles
  role ENUM('super_admin', 'admin', 'moderator', 'reviewer', 'viewer') NOT NULL DEFAULT 'viewer',
  permissions JSON, -- Specific permissions
  department VARCHAR(100),
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  
  -- Session management
  last_login_ip VARCHAR(45),
  login_attempts INT DEFAULT 0,
  locked_until DATETIME NULL,
  
  -- Status
  isActive BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  lastLoginAt TIMESTAMP NULL,
  password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (isActive),
  INDEX idx_email_verified (email_verified)
);

-- Table: api_logs (API request logging for backend)
CREATE TABLE IF NOT EXISTS api_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Request details
  request_headers JSON,
  request_body JSON,
  query_params JSON,
  
  -- Response details
  status_code INT,
  response_time_ms INT,
  response_size_bytes INT,
  
  -- User context
  user_id INT,
  session_id VARCHAR(255),
  
  -- Error tracking
  error_message TEXT,
  stack_trace TEXT,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_endpoint (endpoint),
  INDEX idx_status_code (status_code),
  INDEX idx_ip_address (ip_address),
  INDEX idx_created (createdAt),
  INDEX idx_user_id (user_id)
);

-- Table: system_settings (Application configuration)
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json', 'date') DEFAULT 'string',
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT FALSE, -- Can be exposed to frontend
  is_required BOOLEAN DEFAULT FALSE,
  default_value TEXT,
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_setting_key (setting_key),
  INDEX idx_category (category),
  INDEX idx_is_public (is_public)
);

-- Table: notifications (In-app notification system)
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'success', 'warning', 'error', 'system') DEFAULT 'info',
  
  -- Targeting
  target_type ENUM('all_users', 'admin_users', 'specific_user', 'role_based') DEFAULT 'all_users',
  target_id INT, -- user_id or role
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at DATETIME,
  
  -- Actions
  action_url VARCHAR(500),
  action_text VARCHAR(100),
  
  -- Timestamps
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_target_type (target_type),
  INDEX idx_target_id (target_id),
  INDEX idx_is_read (is_read),
  INDEX idx_is_active (is_active),
  INDEX idx_created (createdAt)
);

-- ============================================================================
-- SECTION 5: ANALYTICS AND REPORTING TABLES
-- ============================================================================

-- Table: analytics_events (User behavior tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(50),
  event_action VARCHAR(100),
  event_label VARCHAR(255),
  
  -- User context
  user_id INT,
  session_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Page context
  page_url VARCHAR(500),
  page_title VARCHAR(255),
  referrer VARCHAR(500),
  
  -- Event data
  event_data JSON,
  event_value DECIMAL(10, 2),
  
  -- Timestamps
  event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_event_name (event_name),
  INDEX idx_event_category (event_category),
  INDEX idx_user_id (user_id),
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (event_timestamp)
);

-- ============================================================================
-- SECTION 6: DEFAULT CONFIGURATION DATA
-- ============================================================================

-- Insert system settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('conference_name', 'Communicable and Non-Communicable Diseases Conference 2025', 'string', 'Official conference name', 'general', TRUE),
('conference_start_date', '2025-11-03', 'date', 'Conference start date', 'general', TRUE),
('conference_end_date', '2025-11-07', 'date', 'Conference end date', 'general', TRUE),
('conference_venue', 'Kampala International Conference Centre', 'string', 'Main conference venue', 'general', TRUE),
('registration_open', 'true', 'boolean', 'Whether registration is open', 'registration', TRUE),
('abstract_submission_open', 'true', 'boolean', 'Whether abstract submission is open', 'abstracts', TRUE),
('max_file_size_mb', '10', 'number', 'Maximum file upload size in MB', 'uploads', FALSE),
('currency_primary', 'UGX', 'string', 'Primary currency for payments', 'payment', TRUE),
('currency_secondary', 'USD', 'string', 'Secondary currency for international', 'payment', TRUE),
('contact_email', 'info@conference2025.ug', 'string', 'Primary contact email', 'contact', TRUE),
('contact_phone', '+256-700-000-000', 'string', 'Primary contact phone', 'contact', TRUE);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO admin_users (username, email, passwordHash, firstName, lastName, role, isActive, email_verified) VALUES
('admin', 'admin@conference2025.ug', '$2b$10$8K5QjGzDYBmh.TnF9xU4cOGVcHF4xN9Pz1yTq6BF8mE2X8wV3yK5L', 'System', 'Administrator', 'super_admin', TRUE, TRUE);

-- Insert sample notifications
INSERT IGNORE INTO notifications (title, message, type, target_type) VALUES
('Welcome to NTLP Conference 2025', 'Thank you for joining our conference management system. Please complete your profile.', 'info', 'all_users'),
('System Maintenance Notice', 'Scheduled maintenance will occur this weekend from 2AM to 4AM EAT.', 'warning', 'all_users');

-- Insert sample contacts for testing
INSERT IGNORE INTO contacts (name, email, subject, message, contact_type, status) VALUES
('Dr. Sarah Johnson', 'sarah@university.edu', 'Keynote Speaker Inquiry', 'I am interested in speaking about infectious disease control strategies.', 'speaker', 'new'),
('Medical Journal Uganda', 'editor@medjournal.ug', 'Media Partnership', 'We would like to explore media partnership opportunities.', 'media', 'new'),
('John Sponsor', 'john@corpsponsors.com', 'Sponsorship Opportunity', 'Our company is interested in sponsoring the conference.', 'sponsorship', 'in-progress');

-- ============================================================================
-- SECTION 7: VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Registration statistics
CREATE OR REPLACE VIEW v_registration_stats AS
SELECT 
    registrationType,
    status,
    payment_status,
    COUNT(*) as count,
    SUM(payment_amount) as total_amount,
    AVG(payment_amount) as avg_amount
FROM registrations 
GROUP BY registrationType, status, payment_status;

-- View: Daily registration counts
CREATE OR REPLACE VIEW v_daily_registrations AS
SELECT 
    DATE(createdAt) as registration_date,
    COUNT(*) as registrations_count,
    SUM(CASE WHEN payment_status = 'completed' THEN 1 ELSE 0 END) as paid_count,
    SUM(payment_amount) as daily_revenue
FROM registrations 
GROUP BY DATE(createdAt)
ORDER BY registration_date DESC;

-- View: Abstract review status
CREATE OR REPLACE VIEW v_abstract_review_status AS
SELECT 
    category,
    status,
    COUNT(*) as count,
    AVG(review_score) as avg_score
FROM abstracts 
GROUP BY category, status;

-- ============================================================================
-- SECTION 8: STORED PROCEDURES FOR COMMON OPERATIONS
-- ============================================================================

-- Procedure: Generate confirmation code
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS GenerateConfirmationCode(IN registration_id INT)
BEGIN
    DECLARE confirmation_code VARCHAR(50);
    SET confirmation_code = CONCAT('CONF2025-', LPAD(registration_id, 6, '0'), '-', SUBSTRING(MD5(RAND()), 1, 4));
    UPDATE registrations SET confirmation_code = confirmation_code WHERE id = registration_id;
END//
DELIMITER ;

-- Procedure: Update payment status
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS UpdatePaymentStatus(
    IN reg_id INT,
    IN new_status VARCHAR(20),
    IN transaction_ref VARCHAR(255),
    IN payment_method_used VARCHAR(50)
)
BEGIN
    UPDATE registrations 
    SET 
        payment_status = new_status,
        payment_reference = transaction_ref,
        payment_method = payment_method_used,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = reg_id;
    
    -- Auto-confirm registration if payment completed
    IF new_status = 'completed' THEN
        UPDATE registrations SET status = 'confirmed' WHERE id = reg_id;
    END IF;
END//
DELIMITER ;

-- ============================================================================
-- SECTION 9: TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Trigger: Auto-generate confirmation code on registration
DELIMITER //
CREATE TRIGGER IF NOT EXISTS tr_registration_confirmation_code 
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    CALL GenerateConfirmationCode(NEW.id);
END//
DELIMITER ;

-- Trigger: Log API access
DELIMITER //
CREATE TRIGGER IF NOT EXISTS tr_log_admin_access 
AFTER UPDATE ON admin_users
FOR EACH ROW
BEGIN
    IF NEW.lastLoginAt != OLD.lastLoginAt THEN
        INSERT INTO analytics_events (event_name, event_category, user_id, event_timestamp)
        VALUES ('admin_login', 'authentication', NEW.id, NEW.lastLoginAt);
    END IF;
END//
DELIMITER ;

-- ============================================================================
-- SECTION 10: SECURITY AND MAINTENANCE
-- ============================================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_composite ON registrations(status, payment_status, registrationType);
CREATE INDEX IF NOT EXISTS idx_contacts_composite ON contacts(status, contact_type, createdAt);
CREATE INDEX IF NOT EXISTS idx_analytics_composite ON analytics_events(event_name, event_timestamp);

-- Show final status
SELECT 'Database setup completed successfully!' AS status;
SELECT 'Tables created:' AS info;
SHOW TABLES;

-- Show user information
SELECT 
    CONCAT('✅ Database: ', DATABASE()) AS setup_info
UNION ALL
SELECT 
    CONCAT('✅ Tables created: ', COUNT(*)) 
FROM information_schema.tables 
WHERE table_schema = DATABASE()
UNION ALL
SELECT 
    CONCAT('✅ Users created: conf_user, conf_admin, conf_readonly') 
UNION ALL
SELECT 
    CONCAT('✅ Default admin user: admin / admin123')
UNION ALL
SELECT 
    CONCAT('✅ Views created: v_registration_stats, v_daily_registrations, v_abstract_review_status')
UNION ALL
SELECT 
    CONCAT('✅ Procedures created: GenerateConfirmationCode, UpdatePaymentStatus')
UNION ALL
SELECT 
    CONCAT('✅ System ready for frontend and backend integration!');
