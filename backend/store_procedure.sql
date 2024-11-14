CREATE OR REPLACE FUNCTION get_all_users(search TEXT, page INT, items INT)
RETURNS TABLE (
    id INT,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    identification VARCHAR,
    "birthDate" DATE,
    status BOOLEAN,
    "userName" VARCHAR,
    email VARCHAR,
    logged BOOLEAN,
    total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        p.first_name,
        p.last_name,
        p.identification,
        p.birth_date,
        u.status,
        u.user_name,
        u.email,
        u.logged,
        COUNT(*) OVER() AS total
    FROM
        public.users u
    LEFT JOIN
        persons p ON u.person_id = p.id
    WHERE
        (p.first_name ILIKE '%' || search || '%' OR p.last_name ILIKE '%' || search || '%')
    ORDER BY
        p.first_name ASC
    LIMIT items OFFSET (page - 1) * items;
END
$$ LANGUAGE plpgsql;
