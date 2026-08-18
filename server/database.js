const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tracker.db');

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('Tester', 'Developer', 'Admin')) NOT NULL
    )
  `);

  // Tickets table
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT CHECK(type IN ('Bug', 'Updation')) NOT NULL,
      details TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL,
      status TEXT CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
      remarks TEXT DEFAULT '',
      submitted_by TEXT NOT NULL,
      FOREIGN KEY(submitted_by) REFERENCES users(username)
    )
  `);

  // Seed default admin account
  db.run(`
    INSERT OR IGNORE INTO users (username, password, role) 
    VALUES ('admin', 'admin123', 'Admin')
  `);
});

module.exports = db;