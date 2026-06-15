const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve files from current folder
app.use(express.static(__dirname));

// Database Connection Pool
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'ashu@123',
    database: 'collegedb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database Connection Error:', err);
        return;
    }

    console.log('Database connected successfully!');
    connection.release();
});

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET All Students
app.get('/api/students', (req, res) => {
    const sql = `
        SELECT s.*, d.department_name
        FROM Student s
        LEFT JOIN Department d
        ON s.department_id = d.department_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// ADD Student
app.post('/api/students', (req, res) => {
    const { student_id, name, department_id, year, email } = req.body;

    const sql = `
        INSERT INTO Student
        (student_id, name, department_id, year, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_id, name, department_id, year, email],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Student added successfully'
            });
        }
    );
});

// UPDATE Student
app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const { name, department_id, year, email } = req.body;

    const sql = `
        UPDATE Student
        SET name = ?,
            department_id = ?,
            year = ?,
            email = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [name, department_id, year, email, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: 'Student updated successfully'
            });
        }
    );
});

// DELETE Student
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM Student
        WHERE student_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: 'Student deleted successfully'
        });
    });
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});