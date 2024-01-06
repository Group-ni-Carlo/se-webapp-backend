-- migrate:up
CREATE TRIGGER update_merch_modtime BEFORE UPDATE ON merch FOR EACH ROW EXECUTE PROCEDURE update_time();

-- migrate:down
DROP TRIGGER update_merch_modtime ON merch;
