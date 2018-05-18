module.exports = {
    "up": "INSERT INTO users (id, name, email, password) VALUES (1, 'admin', 'admin', 'admin')",
    "down": "DELETE FROM users WHERE id = 1"
}