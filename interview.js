const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all interviews
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM interviews ORDER BY start_time ASC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single interview by id
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM interviews WHERE id = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    res.json(row);
  });
});

// Create a new interview
router.post('/', (req, res) => {
  const { participants, start_time, end_time } = req.body;

  // Validate inputs
  if (!participants || participants.length < 2) {
    res.status(400).json({ error: 'At least two participants are required' });
    return;
  }

  const sql = `
    INSERT INTO interviews (participants, start_time, end_time)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [participants, start_time, end_time], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update an existing interview
router.put('/:id', (req, res) => {
  const { participants, start_time, end_time } = req.body;

  // Validate inputs
  if (!participants || participants.length < 2) {
    res.status(400).json({ error: 'At least two participants are required' });
    return;
  }

  const sql = `
    UPDATE interviews
    SET participants = ?, start_time = ?, end_time = ?
    WHERE id = ?
  `;
  db.run(sql, [participants, start_time, end_time, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    res.json({ message: 'Interview updated successfully' });
  });
});

// Delete an existing interview
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM interviews WHERE id = ?';
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    res.json({ message: 'Interview deleted successfully' });
  });
});

module.exports = router;
