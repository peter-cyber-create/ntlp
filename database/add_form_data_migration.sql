-- Migration to add form_data column to payments table
-- This stores form data temporarily until payment is completed

USE ntlp_conference;

-- Add form_data column to store form information before payment completion
ALTER TABLE payments 
ADD COLUMN form_data JSON COMMENT 'Stores form data temporarily until payment is verified';

-- Add index for faster queries
CREATE INDEX idx_payments_form_data ON payments(payment_type, status);
