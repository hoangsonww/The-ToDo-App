-- tasks.sql
CREATE TABLE tasks (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       description VARCHAR(255) NOT NULL,
                       due_date DATE,
                       is_completed BOOLEAN DEFAULT FALSE,
                       is_high_priority BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example Insert - replace with your own data, mine is not published here
INSERT INTO tasks (description, due_date) VALUES ('Buy groceries', '2023-01-10');

-- Example Query
SELECT * FROM tasks WHERE is_completed = FALSE;
