-- ========================================
-- STARTUP-INVESTOR PLATFORM DATABASE
-- ========================================

-- Create Database
CREATE DATABASE IF NOT EXISTS startup_investor_db;
USE startup_investor_db;

-- ========================================
-- USERS TABLE (Base for all user types)
-- ========================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('investor', 'startup', 'admin') NOT NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ========================================
-- INVESTOR PROFILE TABLE
-- ========================================
CREATE TABLE investor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255),
    investment_budget DECIMAL(15, 2) NOT NULL,
    min_investment DECIMAL(15, 2) DEFAULT 50000.00,
    max_investment DECIMAL(15, 2) DEFAULT 500000.00,
    industry_interests JSON, -- ["AI/ML", "E-commerce", "FinTech", etc.]
    startup_stage_preferences JSON, -- ["Idea", "MVP", "Pre-launch", "Early Revenue"]
    location VARCHAR(255),
    years_of_experience INT,
    portfolio_description TEXT,
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    total_deals INT DEFAULT 0,
    total_invested DECIMAL(15, 2) DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_budget (investment_budget)
);

-- ========================================
-- STARTUP PROFILE TABLE
-- ========================================
CREATE TABLE startup_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    startup_stage ENUM('Idea', 'MVP', 'Pre-launch', 'Early Revenue', 'Growth') NOT NULL,
    funding_needed DECIMAL(15, 2) NOT NULL,
    equity_offered DECIMAL(5, 2) NOT NULL, -- Percentage
    pitch_description TEXT NOT NULL,
    company_website VARCHAR(255),
    founding_year INT,
    team_size INT,
    headquarters_city VARCHAR(100),
    headquarters_state VARCHAR(100),
    headquarters_country VARCHAR(100),
    logo_url VARCHAR(255),
    pitch_deck_url VARCHAR(255),
    financial_report_url VARCHAR(255),
    status ENUM('Posted', 'Under Review', 'Approved', 'Funded', 'Closed') DEFAULT 'Posted',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_industry (industry),
    INDEX idx_stage (startup_stage),
    INDEX idx_status (status),
    INDEX idx_funding (funding_needed)
);

-- ========================================
-- DEALS TABLE
-- ========================================
CREATE TABLE deals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startup_id INT NOT NULL,
    investor_id INT NOT NULL,
    investment_amount DECIMAL(15, 2) NOT NULL,
    equity_percentage DECIMAL(5, 2) NOT NULL,
    deal_status ENUM('Posted', 'Under Review', 'Approved', 'Funded', 'Closed') DEFAULT 'Posted',
    startup_commission DECIMAL(5, 2) DEFAULT 2, -- 2% commission from startup
    investor_commission DECIMAL(5, 2) DEFAULT 2, -- 2% commission from investor
    startup_commission_amount DECIMAL(15, 2),
    investor_commission_amount DECIMAL(15, 2),
    total_commission DECIMAL(15, 2),
    deal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_date DATETIME,
    FOREIGN KEY (startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (investor_id) REFERENCES investor_profiles(id) ON DELETE CASCADE,
    INDEX idx_startup_id (startup_id),
    INDEX idx_investor_id (investor_id),
    INDEX idx_deal_status (deal_status)
);

-- ========================================
-- INCUBATION CENTERS TABLE
-- ========================================
CREATE TABLE incubation_centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    description TEXT,
    logo_url VARCHAR(255),
    supported_industries JSON,
    capacity INT,
    acceptance_rate DECIMAL(5, 2),
    program_duration_months INT,
    contact_person_name VARCHAR(255),
    contact_person_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_state (state),
    INDEX idx_city (city)
);

-- ========================================
-- ACCELERATION PROGRAMS TABLE
-- ========================================
CREATE TABLE acceleration_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    description TEXT,
    program_type ENUM('Accelerator', 'Grant Scheme', 'Pitching Round', 'Mentorship') NOT NULL,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    website VARCHAR(255),
    application_url VARCHAR(255),
    eligible_industries JSON,
    funding_amount DECIMAL(15, 2),
    equity_stake DECIMAL(5, 2),
    batch_size INT,
    deadline DATE,
    status ENUM('Open', 'Closed', 'Coming Soon') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_program_type (program_type),
    INDEX idx_deadline (deadline)
);

-- ========================================
-- INCUBATION APPLICATIONS TABLE
-- ========================================
CREATE TABLE incubation_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startup_id INT NOT NULL,
    incubation_center_id INT NOT NULL,
    application_status ENUM('Submitted', 'Under Review', 'Accepted', 'Rejected') DEFAULT 'Submitted',
    application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    decision_date DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (incubation_center_id) REFERENCES incubation_centers(id) ON DELETE CASCADE,
    INDEX idx_startup_id (startup_id),
    INDEX idx_center_id (incubation_center_id),
    INDEX idx_status (application_status)
);

-- ========================================
-- INVESTOR INTERESTS TABLE (Track startup interests)
-- ========================================
CREATE TABLE investor_interests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    investor_id INT NOT NULL,
    startup_id INT NOT NULL,
    interest_type ENUM('Viewed', 'Interested', 'Contacted') DEFAULT 'Viewed',
    status ENUM('Interested', 'DetailsShared') DEFAULT 'Interested',
    shared_email VARCHAR(255),
    shared_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (startup_id) REFERENCES startup_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_interest (investor_id, startup_id),
    INDEX idx_investor_id (investor_id),
    INDEX idx_startup_id (startup_id),
    INDEX idx_status (status)
);

-- ========================================
-- MESSAGES TABLE (For investor-startup communication)
-- ========================================
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    deal_id INT,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL,
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- ADMIN ACTIVITY LOG TABLE
-- ========================================
CREATE TABLE admin_activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type VARCHAR(100),
    entity_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);

-- ========================================
-- SAMPLE DATA (Optional)
-- ========================================

-- Insert sample admin user (password: admin123 hashed with bcrypt)
INSERT INTO users (email, password_hash, full_name, role, is_verified) VALUES
('admin@investstart.com', '$2b$10$YourHashedPasswordHere', 'Admin User', 'admin', TRUE);

COMMIT;
