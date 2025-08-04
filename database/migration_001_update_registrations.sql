-- Migration: Update registrations table for enhanced frontend integration
-- Run this script if you have an existing database that needs to be updated

-- First, check if we need to update the table structure
SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables 
                     WHERE table_schema = DATABASE() AND table_name = 'registrations');

-- If table exists, update it, otherwise create it
IF @table_exists > 0 THEN
    -- Add new columns if they don't exist
    SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                       WHERE table_schema = DATABASE() AND table_name = 'registrations' AND column_name = 'district');
    
    IF @col_exists = 0 THEN
        ALTER TABLE registrations ADD COLUMN district VARCHAR(100) AFTER position;
    END IF;
    
    SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                       WHERE table_schema = DATABASE() AND table_name = 'registrations' AND column_name = 'organization');
    
    IF @col_exists = 0 THEN
        ALTER TABLE registrations ADD COLUMN organization VARCHAR(255) AFTER phone;
    END IF;
    
    -- Rename institution to organization if it exists
    SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                       WHERE table_schema = DATABASE() AND table_name = 'registrations' AND column_name = 'institution');
    
    IF @col_exists > 0 THEN
        ALTER TABLE registrations CHANGE COLUMN institution organization VARCHAR(255);
    END IF;
    
    -- Add payment related columns
    SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                       WHERE table_schema = DATABASE() AND table_name = 'registrations' AND column_name = 'payment_amount');
    
    IF @col_exists = 0 THEN
        ALTER TABLE registrations ADD COLUMN payment_amount DECIMAL(10,2) AFTER special_requirements;
        ALTER TABLE registrations ADD COLUMN payment_currency VARCHAR(3) DEFAULT 'UGX' AFTER payment_amount;
        ALTER TABLE registrations ADD COLUMN payment_reference VARCHAR(255) AFTER payment_currency;
        ALTER TABLE registrations ADD COLUMN is_verified BOOLEAN DEFAULT FALSE AFTER dietary_requirements;
        ALTER TABLE registrations ADD COLUMN payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending' AFTER is_verified;
    END IF;
    
    -- Rename special_needs to special_requirements if it exists
    SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns 
                       WHERE table_schema = DATABASE() AND table_name = 'registrations' AND column_name = 'special_needs');
    
    IF @col_exists > 0 THEN
        ALTER TABLE registrations CHANGE COLUMN special_needs special_requirements TEXT;
    END IF;
    
    -- Update registration_type enum values
    ALTER TABLE registrations MODIFY COLUMN registration_type ENUM('undergrad', 'grad', 'local', 'intl', 'online') NOT NULL;
    
    -- Add indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_district ON registrations(district);
    CREATE INDEX IF NOT EXISTS idx_payment_status ON registrations(payment_status);
    CREATE INDEX IF NOT EXISTS idx_registration_type ON registrations(registration_type);
    
    -- Remove old indexes that might not be needed
    DROP INDEX IF EXISTS idx_session_track ON registrations;
    
ELSE
    -- Create the full table if it doesn't exist
    CREATE TABLE registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        organization VARCHAR(255),
        position VARCHAR(255),
        district VARCHAR(100),
        country VARCHAR(100) DEFAULT 'Uganda',
        registration_type ENUM('undergrad', 'grad', 'local', 'intl', 'online') NOT NULL,
        special_requirements TEXT,
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
END IF;

-- Update settings table with pricing information
INSERT IGNORE INTO settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('undergrad_price_ugx', '100000', 'number', 'Undergraduate student price in UGX', 'pricing', TRUE),
('grad_price_ugx', '150000', 'number', 'Graduate student price in UGX', 'pricing', TRUE),
('local_price_ugx', '350000', 'number', 'Local participant price in UGX', 'pricing', TRUE),
('intl_price_usd', '300', 'number', 'International participant price in USD', 'pricing', TRUE),
('online_price_usd', '50', 'number', 'Online participation price in USD', 'pricing', TRUE),
('online_price_ugx', '180000', 'number', 'Online participation price in UGX', 'pricing', TRUE);

-- Migration completed
SELECT 'Migration completed successfully' as status;
