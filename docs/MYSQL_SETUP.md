# NTLP Conference 2025 - MySQL Database Setup Guide

## Complete MySQL Database Configuration for Uganda National Health Conference

### 1. MySQL Database Schema

```sql
-- Create the main database
CREATE DATABASE IF NOT EXISTS ntlp_conference_2025 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE ntlp_conference_2025;

-- Create users table for admin authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Create registrations table
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    organization VARCHAR(255), -- Changed from institution to match frontend
    position VARCHAR(255),
    district VARCHAR(100), -- Added district field from frontend
    country VARCHAR(100) DEFAULT 'Uganda',
    registration_type ENUM('undergrad', 'grad', 'local', 'intl', 'online') NOT NULL, -- Updated to match frontend ticket types
    special_requirements TEXT, -- Changed from special_needs to match backend field name
    dietary_requirements TEXT,
    
    -- Payment and verification fields
    is_verified BOOLEAN DEFAULT FALSE,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    payment_currency VARCHAR(3) DEFAULT 'UGX',
    payment_reference VARCHAR(255),
    
    -- Status and tracking
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_registration_type (registration_type),
    INDEX idx_registration_date (registration_date),
    INDEX idx_district (district)
);

-- Create abstracts table
CREATE TABLE abstracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    abstract_text TEXT NOT NULL,
    keywords VARCHAR(500),
    category ENUM('communicable_diseases', 'non_communicable_diseases', 'health_systems', 'digital_health', 'research_methodology') NOT NULL,
    presentation_type ENUM('oral', 'poster') NOT NULL,
    
    -- Primary Author Information
    primary_author_first_name VARCHAR(100) NOT NULL,
    primary_author_last_name VARCHAR(100) NOT NULL,
    primary_author_email VARCHAR(255) NOT NULL,
    primary_author_institution VARCHAR(255) NOT NULL,
    primary_author_department VARCHAR(255),
    primary_author_position VARCHAR(255),
    primary_author_phone VARCHAR(20),
    primary_author_country VARCHAR(100) DEFAULT 'Uganda',
    
    -- File Information
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size INT,
    file_type VARCHAR(50),
    
    -- Review Information
    status ENUM('pending', 'under_review', 'accepted', 'rejected') DEFAULT 'pending',
    review_comments TEXT,
    reviewer_id INT,
    reviewed_at TIMESTAMP NULL,
    
    -- Metadata
    conflict_of_interest TEXT,
    funding_source VARCHAR(255),
    ethical_approval BOOLEAN DEFAULT FALSE,
    
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_primary_author_email (primary_author_email),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_presentation_type (presentation_type),
    INDEX idx_submitted_at (submitted_at),
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create co-authors table (for multiple authors per abstract)
CREATE TABLE co_authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    abstract_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    country VARCHAR(100) DEFAULT 'Uganda',
    author_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (abstract_id) REFERENCES abstracts(id) ON DELETE CASCADE,
    INDEX idx_abstract_id (abstract_id),
    INDEX idx_email (email),
    UNIQUE KEY unique_author_order (abstract_id, author_order)
);

-- Create contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    inquiry_type ENUM('general', 'sponsorship', 'speaking', 'technical', 'partnership') DEFAULT 'general',
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to INT,
    responded_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_inquiry_type (inquiry_type),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Create speakers table
CREATE TABLE speakers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    institution VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Uganda',
    bio TEXT,
    profile_image_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    website_url VARCHAR(500),
    
    -- Speaking Details
    session_track ENUM('communicable_diseases', 'non_communicable_diseases', 'health_systems', 'digital_health') NOT NULL,
    presentation_title VARCHAR(500),
    presentation_abstract TEXT,
    presentation_type ENUM('keynote', 'plenary', 'panel', 'workshop', 'poster') NOT NULL,
    session_date DATE,
    session_time TIME,
    session_duration INT, -- in minutes
    
    status ENUM('invited', 'confirmed', 'declined', 'pending') DEFAULT 'invited',
    travel_required BOOLEAN DEFAULT FALSE,
    accommodation_required BOOLEAN DEFAULT FALSE,
    honorarium_amount DECIMAL(10,2),
    
    invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_session_track (session_track),
    INDEX idx_session_date (session_date)
);

-- Create sessions table for conference agenda
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    session_type ENUM('keynote', 'plenary', 'panel', 'workshop', 'break', 'networking') NOT NULL,
    track ENUM('communicable_diseases', 'non_communicable_diseases', 'health_systems', 'digital_health', 'general') NOT NULL,
    venue VARCHAR(255),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INT DEFAULT 100,
    
    moderator_id INT,
    session_chair_id INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_session_date (session_date),
    INDEX idx_track (track),
    INDEX idx_session_type (session_type),
    FOREIGN KEY (moderator_id) REFERENCES speakers(id) ON DELETE SET NULL,
    FOREIGN KEY (session_chair_id) REFERENCES speakers(id) ON DELETE SET NULL
);

-- Create session_speakers junction table
CREATE TABLE session_speakers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    speaker_id INT NOT NULL,
    presentation_order INT,
    presentation_duration INT, -- in minutes
    
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_speaker (session_id, speaker_id),
    INDEX idx_session_id (session_id),
    INDEX idx_speaker_id (speaker_id)
);

-- Create sponsors/partners table
CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    description TEXT,
    partnership_type ENUM('platinum', 'gold', 'silver', 'bronze', 'media', 'institutional') NOT NULL,
    contribution_amount DECIMAL(12,2),
    benefits TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    status ENUM('prospective', 'confirmed', 'active', 'completed') DEFAULT 'prospective',
    contract_signed BOOLEAN DEFAULT FALSE,
    payment_received BOOLEAN DEFAULT FALSE,
    
    partnership_start_date DATE,
    partnership_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_partnership_type (partnership_type),
    INDEX idx_status (status)
);

-- Create audit log table for tracking changes
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create system settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_category (category)
);
```

### 2. Initial Data Setup

```sql
-- Insert default admin user (password: admin123 - should be changed immediately)
INSERT INTO users (email, password_hash, role) VALUES 
('admin@ntlpconference.ug', '$2b$12$LQv3c1yqBw3HhU4oXGY9Ce2T1/OxD/Zc4tKqJ3aQmGqL4kVYnqE5K', 'admin');

-- Insert basic system settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('conference_name', 'The Communicable and Non-Communicable Diseases Conference 2025', 'string', 'Official conference name', 'general', TRUE),
('conference_date_start', '2025-09-15', 'string', 'Conference start date', 'general', TRUE),
('conference_date_end', '2025-09-17', 'string', 'Conference end date', 'general', TRUE),
('conference_venue', 'Speke Resort Munyonyo, Kampala, Uganda', 'string', 'Main conference venue', 'general', TRUE),
('registration_enabled', 'true', 'boolean', 'Enable/disable registration', 'registration', TRUE),
('abstract_submission_enabled', 'true', 'boolean', 'Enable/disable abstract submission', 'abstracts', TRUE),
('abstract_submission_deadline', '2025-08-15', 'string', 'Abstract submission deadline', 'abstracts', TRUE),
('early_bird_deadline', '2025-07-31', 'string', 'Early bird registration deadline', 'registration', TRUE),
('max_abstracts_per_author', '3', 'number', 'Maximum abstracts per primary author', 'abstracts', FALSE),
('conference_capacity', '500', 'number', 'Maximum conference capacity', 'general', FALSE),

-- Insert registration pricing information
('undergrad_price_ugx', '100000', 'number', 'Undergraduate student price in UGX', 'pricing', TRUE),
('grad_price_ugx', '150000', 'number', 'Graduate student price in UGX', 'pricing', TRUE),
('local_price_ugx', '350000', 'number', 'Local participant price in UGX', 'pricing', TRUE),
('intl_price_usd', '300', 'number', 'International participant price in USD', 'pricing', TRUE),
('online_price_usd', '50', 'number', 'Online participation price in USD', 'pricing', TRUE),
('online_price_ugx', '180000', 'number', 'Online participation price in UGX', 'pricing', TRUE);

-- Insert sample session tracks
INSERT INTO sessions (title, description, session_type, track, venue, session_date, start_time, end_time) VALUES
('Opening Ceremony', 'Official opening of the conference', 'keynote', 'general', 'Main Hall', '2025-09-15', '08:00:00', '09:00:00'),
('Communicable Diseases: Current Challenges', 'Panel discussion on current challenges in communicable disease management', 'panel', 'communicable_diseases', 'Conference Room A', '2025-09-15', '09:30:00', '11:00:00'),
('Digital Health Innovations', 'Showcase of digital health solutions', 'workshop', 'digital_health', 'Conference Room B', '2025-09-15', '09:30:00', '11:00:00'),
('Coffee Break', 'Networking break', 'break', 'general', 'Lobby', '2025-09-15', '11:00:00', '11:30:00'),
('NCDs Prevention Strategies', 'Strategies for preventing non-communicable diseases', 'plenary', 'non_communicable_diseases', 'Main Hall', '2025-09-15', '11:30:00', '12:30:00');
```

### 3. Environment Configuration

Update your `.env.local` file to match the ntlp-backend configuration:

```env
# Database Configuration (Aligned with ntlp-backend Docker setup)
DB_HOST=localhost
DB_PORT=3306
DB_USER=ntlp_user
DB_PASSWORD=secure_password_here
DB_NAME=ntlp_conference_2025

# MySQL Connection Pool Settings (matching Docker backend config)
DATABASE_CONNECTION_LIMIT=10
DATABASE_QUEUE_LIMIT=0
DATABASE_WAIT_FOR_CONNECTIONS=true

# For production (matching your production environment)
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Admin Configuration
ADMIN_EMAIL=admin@ntlpconference.ug
ADMIN_PASSWORD_DEFAULT=admin123

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
UPLOAD_DIR=uploads

# Email Configuration (optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
FROM_EMAIL=noreply@ntlpconference.ug

# Security
JWT_SECRET=your_very_secure_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Conference Settings
CONFERENCE_NAME="The Communicable and Non-Communicable Diseases Conference 2025"
CONFERENCE_YEAR=2025
CONFERENCE_VENUE="Speke Resort Munyonyo, Kampala, Uganda"

# Backend Compatibility (for production deployment at 172.27.0.9)
BACKEND_PORT=5000
BACKEND_HOST=localhost
```

### 4. Installation and Setup Procedure

1. **Install MySQL Server**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mysql-server
   
   # CentOS/RHEL
   sudo yum install mysql-server
   
   # macOS (using Homebrew)
   brew install mysql
   
   # Windows - Download from https://dev.mysql.com/downloads/installer/
   ```

2. **Secure MySQL Installation**
   ```bash
   sudo mysql_secure_installation
   ```

3. **Create Database and User (Matching ntlp-backend Docker config)**
   ```sql
   mysql -u root -p
   
   CREATE DATABASE ntlp_conference_2025 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'ntlp_user'@'localhost' IDENTIFIED BY 'secure_password_here';
   GRANT ALL PRIVILEGES ON ntlp_conference_2025.* TO 'ntlp_user'@'localhost';
   
   -- For production environment (172.27.0.9)
   CREATE USER 'ntlp_user'@'172.27.0.9' IDENTIFIED BY 'secure_password_here';
   GRANT ALL PRIVILEGES ON ntlp_conference_2025.* TO 'ntlp_user'@'172.27.0.9';
   
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Run the Schema Script (Aligned with ntlp-backend)**
   ```bash
   mysql -u ntlp_user -p ntlp_conference_2025 < database_schema.sql
   
   # Or run the migration script for existing databases:
   mysql -u ntlp_user -p ntlp_conference_2025 < database/migration_001_update_registrations.sql
   ```

5. **Install Node.js Dependencies**
   ```bash
   npm install mysql2 @types/mysql2
   ```

6. **Update Environment Variables**
   - Copy the environment variables above to your `.env.local`
   - Update with your actual database credentials

### 5. Backup and Maintenance (Aligned with ntlp-backend)

```sql
-- Daily backup script (matching your backend database name)
mysqldump -u ntlp_user -p ntlp_conference_2025 > backup_$(date +%Y%m%d).sql

-- Weekly cleanup of old audit logs (keep 3 months)
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);

-- Index optimization (run monthly)
OPTIMIZE TABLE registrations, abstracts, contacts, speakers, sessions;

-- Performance monitoring queries
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;
```

### 6. Production Considerations

1. **Performance Tuning**
   - Enable query cache
   - Configure innodb_buffer_pool_size (70-80% of RAM)
   - Set appropriate connection limits
   - Enable slow query logging

2. **Security**
   - Use SSL connections
   - Regular security updates
   - Implement proper backup encryption
   - Use strong passwords and rotate regularly

3. **Monitoring**
   - Set up MySQL monitoring (Prometheus + Grafana)
   - Configure alerts for high CPU/memory usage
   - Monitor slow queries and optimize

4. **Scaling**
   - Consider read replicas for high traffic
   - Implement connection pooling
   - Use Redis for session management
   - Consider database sharding if needed

This setup provides a robust, scalable foundation for the NTLP Conference management system.
