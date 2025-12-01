-- The Inner Edit Database Schema
-- For Cloudflare D1

-- Contacts table for form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'new' -- new, read, replied
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT 1,
  source TEXT DEFAULT 'website' -- website, shop, etc
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(active);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
