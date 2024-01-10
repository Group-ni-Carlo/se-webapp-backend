export const filterSettings = new Map();
filterSettings.set(
  1,
  `SELECT MAX(m.id) AS id, 
    m.title, 
    MAX(m.image_file) AS image_file, 
    MAX(m.price) AS price, 
    COUNT(o.merch_id) AS sales, 
    (MAX(m.price) * COUNT(o.merch_id)) AS revenue 
    FROM Orders AS o
    INNER JOIN Merch AS m ON o.merch_id = m.id
    GROUP BY m.title
    ORDER BY MAX(m.price) ASC;`
);
filterSettings.set(
  2,
  `SELECT MAX(m.id) AS id, 
    m.title, 
    MAX(m.image_file) AS image_file, 
    MAX(m.price) AS price, 
    COUNT(o.merch_id) AS sales, 
    (MAX(m.price) * COUNT(o.merch_id)) AS revenue 
    FROM Orders AS o
    INNER JOIN Merch AS m ON o.merch_id = m.id
    GROUP BY m.title
    ORDER BY MAX(m.price) DESC;`
);
filterSettings.set(
  3,
  `SELECT MAX(m.id) AS id, 
    m.title, 
    MAX(m.image_file) AS image_file, 
    MAX(m.price) AS price, 
    COUNT(o.merch_id) AS sales, 
    (MAX(m.price) * COUNT(o.merch_id)) AS revenue 
    FROM Orders AS o
    INNER JOIN Merch AS m ON o.merch_id = m.id
    GROUP BY m.title
    ORDER BY COUNT(o.merch_id) ASC;`
);
filterSettings.set(
  4,
  `SELECT MAX(m.id) AS id, 
    m.title, 
    MAX(m.image_file) AS image_file, 
    MAX(m.price) AS price, 
    COUNT(o.merch_id) AS sales, 
    (MAX(m.price) * COUNT(o.merch_id)) AS revenue 
    FROM Orders AS o
    INNER JOIN Merch AS m ON o.merch_id = m.id
    GROUP BY m.title
    ORDER BY COUNT(o.merch_id) DESC;`
);
