const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'new_password',
  database: 'interviewdatabase',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error(`Failed to connect to MySQL database: ${err.message}`);
    return;
  }
  console.log(`Connected to MySQL database`);
});

module.exports = connection;
