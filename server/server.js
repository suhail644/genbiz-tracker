const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Authentication
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;
  db.get(
    'SELECT id, username, role FROM users WHERE username = ? AND password = ? AND role = ?',
    [username, password, role],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(401).json({ error: 'Invalid credentials or role' });
      res.json({ user: row });
    }
  );
});

// 2. Admin: User Creation
app.post('/api/users', (req, res) => {
  const { username, password, role } = req.body;
  db.run(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, role],
    function (err) {
      if (err) return res.status(400).json({ error: 'User already exists or invalid data' });
      res.json({ id: this.lastID, username, role });
    }
  );
});

// 3. Admin & Devs: Fetch All Tickets
app.get('/api/tickets', (req, res) => {
  const { submitted_by } = req.query;
  const query = submitted_by 
    ? 'SELECT * FROM tickets WHERE submitted_by = ? ORDER BY id DESC'
    : 'SELECT * FROM tickets ORDER BY id DESC';
  const params = submitted_by ? [submitted_by] : [];

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. Tester: Create Bug / Updation Ticket
app.post('/api/tickets', (req, res) => {
  const { date, type, details, priority, submitted_by } = req.body;
  db.run(
    'INSERT INTO tickets (date, type, details, priority, submitted_by) VALUES (?, ?, ?, ?, ?)',
    [date, type, details, priority, submitted_by],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, status: 'Open' });
    }
  );
});

// 5. Developer: Update Status & Remarks
app.patch('/api/tickets/:id', (req, res) => {
  const { status, remarks } = req.body;
  db.run(
    'UPDATE tickets SET status = COALESCE(?, status), remarks = COALESCE(?, remarks) WHERE id = ?',
    [status, remarks, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

app.listen(5000, () => console.log('Backend running on port 5000'));