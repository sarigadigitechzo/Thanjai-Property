-- Thanjai Property CRM - Full 16-Heading Database Schema
-- Run this in the SQL tab of your phpMyAdmin

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";


-- 2. CRM Pipeline (Leads)
CREATE TABLE IF NOT EXISTS `leads` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `purpose` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'New',
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Properties Inventory
CREATE TABLE IF NOT EXISTS `properties` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `categoryRaw` varchar(50) DEFAULT NULL,
  `categoryLabel` varchar(100) DEFAULT NULL,
  `purpose` varchar(20) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `priceFormatted` varchar(50) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `address` text,
  `size` varchar(100) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `furnishing` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Available',
  `availability` varchar(50) DEFAULT 'Available',
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `videoUrl` varchar(255) DEFAULT NULL,
  `ownerName` varchar(255) DEFAULT NULL,
  `ownerPhone` varchar(50) DEFAULT NULL,
  `listedBy` varchar(100) DEFAULT NULL,
  `images` longtext,
  `description` text,
  `features` longtext,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Site Visits & Appts
CREATE TABLE IF NOT EXISTS `site_visits` (
  `id` varchar(50) NOT NULL,
  `leadId` varchar(50) DEFAULT NULL,
  `propertyId` varchar(50) DEFAULT NULL,
  `visitDate` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Scheduled',
  `assignedTo` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Partner Network
CREATE TABLE IF NOT EXISTS `partners` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `commission_rate` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. AI Operating Agent (Logs)
CREATE TABLE IF NOT EXISTS `ai_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(50) DEFAULT NULL,
  `prompt` text NOT NULL,
  `response` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. WhatsApp Log
CREATE TABLE IF NOT EXISTS `whatsapp_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `direction` varchar(20) DEFAULT 'Inbound',
  `status` varchar(20) DEFAULT 'Delivered',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `report_name` varchar(255) NOT NULL,
  `generated_by` varchar(100) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Settings
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Portal Users Overview
CREATE TABLE IF NOT EXISTS `portal_users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'User',
  `status` varchar(50) DEFAULT 'Active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Audit Log
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` varchar(100) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `module` varchar(100) DEFAULT NULL,
  `details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Blog Posts CMS
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `readTime` varchar(50) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `authorAvatar` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `excerpt` text,
  `content` longtext,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Website Images
CREATE TABLE IF NOT EXISTS `website_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_key` varchar(100) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Admin Staff & Access
CREATE TABLE IF NOT EXISTS `admin_staff` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'Admin',
  `permissions_json` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
