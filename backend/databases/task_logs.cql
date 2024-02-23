-- task_logs.cql
CREATE TABLE task_logs (
                           task_id UUID PRIMARY KEY,
                           description TEXT,
                           status TEXT,
                           priority TEXT,
                           timestamp TIMESTAMP,
                           user_id UUID
);

-- Example Insert (replace with your own values - mine are not published here)
INSERT INTO task_logs (task_id, description, status, priority, timestamp, user_id) VALUES (uuid(), 'Meeting with team', 'pending', 'high', toTimestamp(now()), uuid());

-- Example Query
SELECT * FROM task_logs WHERE user_id = uuid();
