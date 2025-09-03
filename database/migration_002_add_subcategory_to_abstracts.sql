-- Migration: Add subcategory to abstracts table
ALTER TABLE abstracts ADD COLUMN subcategory VARCHAR(255) AFTER category;
