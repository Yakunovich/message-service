CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    text VARCHAR(128) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    order_num INTEGER NOT NULL
);

CREATE INDEX idx_messages_timestamp ON messages(timestamp); 