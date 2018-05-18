module.exports = {
    "up": "CREATE TABLE users (id INT NOT NULL, UNIQUE KEY id (id), name TEXT, password VARCHAR(255), email VARCHAR(60) )",
    "down": "DROP TABLE users"
}