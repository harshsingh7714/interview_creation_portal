
const express = require('express');
// const bodyParser = require('body-parser');
const db = require('./db'); // Import the db.js file

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


// Set up route to handle form submission
app.post('/interviews', (req, res) => {
	// Get values from form submission
	const participant = req.body.participant;
	const start_time = req.body.start_time;
	const end_time = req.body.end_time;
  
	// Insert values into database
	connection.query('INSERT INTO interviews (participant, start_time, end_time) VALUES (?, ?, ?)', [participant, start_time, end_time], (error, results, fields) => {
	  if (error) {
		console.error('Error inserting data into database: ', error);
		res.status(500).json({ error: 'Error inserting data into database.' });
		return;
	  }
  
	  console.log('Data inserted into database.');
	  res.status(200).json({ success: true });
	});
  });
// POST request to create a new interview
app.post('/interviews', (req, res) => {
  const { participants, startTime, endTime } = req.body;
  // Check if number of participants is less than 2
  if (participants.length < 2) {
    return res.status(400).json({ message: 'Number of participants must be at least 2' });
  }
  // Check if any participant has another interview scheduled during the given time
  const query = 'SELECT COUNT(*) as count FROM interviews WHERE ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?)) AND participant_id IN (?)';
  const values = [startTime, startTime, endTime, endTime, startTime, endTime, participants];
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (results[0].count > 0) {
      return res.status(400).json({ message: 'One or more participants are not available during the given time' });
    }
    // Insert the new interview into the database
    const insertQuery = 'INSERT INTO interviews (participant_id, start_time, end_time) VALUES ?';
    const interviewData = participants.map(participant => [participant, startTime, endTime]);
    connection.query(insertQuery, [interviewData], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      return res.status(201).json({ message: 'Interview created successfully' });
    });
  });
});

// GET request to retrieve all interviews
app.get('/interviews', (req, res) => {
  const query = 'SELECT * FROM interviews';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    return res.status(200).json({ interviews: results });
  });
})
// Render the interview creation page
app.get('/interviews/new', (req, res) => {
	res.render('new_interview');
});

// Handle the creation of a new interview
app.post('/interviews', (req, res) => {
	// Get the data from the request body
	const { participants, start_time, end_time } = req.body;
	// Check if there are at least 2 participants
	if (participants.length < 2) {
		return res.status(400).send('There must be at least 2 participants.');
	}
	// Check if any of the participants is not available during the scheduled time
	const sql = `SELECT * FROM interviews WHERE (start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?) OR (start_time >= ? AND end_time <= ?)`;
	db.query(sql, [end_time, start_time, start_time, end_time, start_time, end_time], (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			return res.status(400).send('One or more participants is not available during the scheduled time.');
		}
		// Insert the new interview into the database
		const sql = `INSERT INTO interviews (participant, start_time, end_time) VALUES ?`;
		const values = participants.map(participant => [participant, start_time, end_time]);
		db.query(sql, [values], (err, results) => {
			if (err) throw err;
			// Redirect to the interviews page
			res.redirect('/interviews');
		});
	});
});
// Handle the update of an existing interview
app.put('/interviews/:id', (req, res) => {
	// Get the data from the request body
	const { participant, start_time, end_time } = req.body;
	// Check if any of the participants is not available during the scheduled time
	const sql = `SELECT * FROM interviews WHERE (start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?) OR (start_time >= ? AND end_time <= ?)`;
	db.query(sql, [end_time, start_time, start_time, end_time, start_time, end_time], (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			return res.status(400).send('One or more participants is not available during the scheduled time.');
		}
		// Update the interview in the database
		const sql = `UPDATE interviews SET participant = ?, start_time = ?, end_time = ? WHERE id = ?`;
		db.query(sql, [participant, start_time, end_time, req.params.id], (err, results) => {
			if (err) throw err;
			// Redirect to the interviews page
			res.redirect('/interviews');
		});
	});
});

// Handle the deletion of an existing interview
app.delete('/interviews/:id', (req, res) => {
	// Delete the interview with the given ID from the database
	const sql = `DELETE FROM interviews WHERE id = ?`;
	db.query(sql, [req.params.id], (err, results) => {
		if (err) throw err;
		// Redirect to the interviews page
		res.redirect('/interviews');
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
