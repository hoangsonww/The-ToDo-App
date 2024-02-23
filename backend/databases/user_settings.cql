-- user_settings.cql
CREATE TABLE user_settings (
                               user_id UUID PRIMARY KEY,
                               dark_mode BOOLEAN,
                               email_notifications BOOLEAN,
                               task_reminders BOOLEAN
);

-- Example Insert (replace with your own data - mine are not published here)
INSERT INTO user_settings (user_id, dark_mode, email_notifications, task_reminders) VALUES (uuid(), TRUE, TRUE, FALSE);

-- Example Query
SELECT * FROM user_settings WHERE dark_mode = TRUE;
