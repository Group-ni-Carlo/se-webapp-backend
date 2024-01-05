-- migrate:up
CREATE OR REPLACE FUNCTION insert_into_admins() RETURNS TRIGGER AS $$
BEGIN
 IF NEW.type = 'admin' THEN
   INSERT INTO Admins(user_id, officer_position) VALUES (NEW.id, 'Admin');
 END IF;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update
AFTER UPDATE OF type ON Users
FOR EACH ROW
EXECUTE PROCEDURE insert_into_admins();

-- migrate:down
DROP TRIGGER users_update ON Users;
