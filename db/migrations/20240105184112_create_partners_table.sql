-- migrate:up
CREATE TABLE Partners(
    id SERIAL,
    title VARCHAR(60),
    logo_file VARCHAR,
    date_created TIMESTAMP,
    date_last_edit TIMESTAMP,
    admin_id INT
    FOREIGN KEY (admin_id) REFERENCES Admins(id)
    ON DELETE CASCADE
)

-- migrate:down
DROP TABLE Partners
