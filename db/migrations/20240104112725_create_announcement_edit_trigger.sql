-- migrate:up
CREATE OR REPLACE FUNCTION update_time() RETURNS TRIGGER AS $$
BEGIN
 NEW.date_last_edit = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_announcements_modtime BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE PROCEDURE update_time();


-- migrate:down
DROP TRIGGER update_announcements_modtime ON announcements;
