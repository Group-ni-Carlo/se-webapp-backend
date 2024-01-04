-- migrate:up
CREATE TABLE Admins(
	id SERIAL PRIMARY KEY NOT NULL,
	officer_position VARCHAR(255) NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users(id)
	ON DELETE CASCADE
)

-- migrate:down
DROP TABLE Admins
