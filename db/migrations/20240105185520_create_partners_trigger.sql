-- migrate:up
CREATE TRIGGER update_partners_modtime BEFORE UPDATE ON Partners FOR EACH ROW EXECUTE PROCEDURE update_time();


-- migrate:down
DROP TRIGGER update_partners_modtime ON Partners;
