-- migrate:up
CREATE TABLE Orders(
	id SERIAL NOT NULL PRIMARY KEY,
	buyer_name VARCHAR NOT NULL,
	size VARCHAR NOT NULL,
	merch_id INT,
	date_created TIMESTAMP NOT NULL DEFAULT(NOW()),
	FOREIGN KEY (merch_id) REFERENCES Merch(id)
)

-- migrate:down
DROP TABLE Orders