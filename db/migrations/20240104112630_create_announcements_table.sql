-- migrate:up
CREATE TABLE Announcements(
	id SERIAL PRIMARY KEY NOT NULL,
	title VARCHAR(255) NOT NULL,
	CAPTION VARCHAR(2048) NOT NULL,
	image_file VARCHAR(255) NOT NULL,
	date_created TIMESTAMP NOT NULL DEFAULT(NOW()),
	date_last_edit TIMESTAMP NOT NULL,
	admin_id INT NOT NULL,
	FOREIGN KEY (admin_id) REFERENCES Admins(id)
)

-- migrate:down
DROP TABLE Announcements
