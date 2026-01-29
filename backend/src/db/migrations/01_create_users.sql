-- Create ENUMs
DROP TYPE IF EXISTS kyc_status_enum CASCADE;
CREATE TYPE kyc_status_enum AS ENUM ('NONE', 'PENDING', 'VERIFIED_VNEID');

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for Mock login
    wallet_address VARCHAR(42),
    kyc_status kyc_status_enum DEFAULT 'NONE',
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'BUYER', -- BUYER / SELLER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
