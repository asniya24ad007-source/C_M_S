const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'ashu@123',
    database: 'collegedb'
});

connection.connect((err) => {
    if (err) {
        console.error('Connection Error:', err);
        return;
    }

    console.log('Connected to MySQL successfully!');
    connection.end();
});