-- Run this script in your cPanel phpMyAdmin or via MySQL command line

CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(100),
    categoryRaw VARCHAR(100),
    categoryLabel VARCHAR(100),
    purpose VARCHAR(50),
    price DECIMAL(15,2),
    priceFormatted VARCHAR(100),
    location VARCHAR(255),
    district VARCHAR(100),
    address TEXT,
    size VARCHAR(100),
    bedrooms INT NULL,
    bathrooms INT NULL,
    furnishing VARCHAR(100),
    status VARCHAR(50),
    availability VARCHAR(50),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    videoUrl VARCHAR(255),
    ownerName VARCHAR(255),
    ownerPhone VARCHAR(50),
    listedBy VARCHAR(255),
    images JSON,
    description TEXT,
    features JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50),
    budget VARCHAR(100),
    requirement VARCHAR(255),
    location VARCHAR(255),
    timeline VARCHAR(100),
    assignedTo VARCHAR(255),
    notes TEXT,
    stage VARCHAR(50) DEFAULT 'new',
    stageDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lead_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leadId VARCHAR(50) NOT NULL,
    type VARCHAR(50), -- 'status', 'note', 'call', 'visit'
    title VARCHAR(255),
    description TEXT,
    author VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE
);
