-- Migration script to add justification field to existing applications
-- This script adds the justification field to the Application model

-- Note: MongoDB doesn't use traditional SQL migrations
-- This is a reference for the field that needs to be added
-- The Prisma client will handle the schema updates automatically

-- New field added to Application model:
-- justification: String (required field for user's motivation and qualifications)

-- If you need to update existing records, you can use MongoDB operations
-- to add default values or handle the migration programmatically
