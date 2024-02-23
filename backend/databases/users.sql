-- users.sql
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       dark_mode BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example Insert (replace with your own data, mine is not published here)
INSERT INTO users (username, email, password_hash) VALUES ('johndoe', 'john@example.com', 'hashedpassword123');

-- Example Query
SELECT * FROM users WHERE dark_mode = TRUE;
