-- migrate:up
CREATE TABLE UserLogins(
	id SERIAL PRIMARY KEY NOT NULL,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES Users(id)
 ON DELETE CASCADE
)

-- migrate:down
DROP TABLE UserLogins
