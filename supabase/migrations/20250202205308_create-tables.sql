-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- support uid from rpc()
CREATE FUNCTION uid() RETURNS uuid AS $$
  SELECT auth.uid();
$$ LANGUAGE sql STABLE;

CREATE FUNCTION utc_now() RETURNS BIGINT AS $$
   SELECT EXTRACT(EPOCH FROM now())::BIGINT * 1000;
$$ LANGUAGE sql STABLE;

create function base62_encode(value bigint) returns text as $$
declare
    chars text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    base integer := 62;
    result text := '';
    remainder integer;
begin
    while value > 0 loop
        remainder := (value % base);
        result := substr(chars, remainder + 1, 1) || result;
        value := value / base;
    end loop;

    -- Ensure minimum length (pad with '0' if too short)
    while length(result) < 8 loop
        result := '0' || result;
    end loop;

    return result;
end;
$$ language plpgsql immutable strict;

CREATE FUNCTION short_uuid(table_name TEXT) RETURNS TEXT AS $$ 
DECLARE
    short_id TEXT;
    numeric_part BIGINT;
    query TEXT;
    id_exists BOOLEAN;
BEGIN
    LOOP
        -- Convert part of UUID (first 8 hex digits) to an integer
        numeric_part := ('x' || left(gen_random_uuid()::TEXT, 8))::bit(32)::bigint;

        -- Encode it in Base62
        short_id := base62_encode(numeric_part);

        -- Construct dynamic query to check uniqueness
        query := format('SELECT EXISTS (SELECT 1 FROM %I WHERE id = $1)', table_name);

        -- Execute query and store result
        EXECUTE query INTO id_exists USING short_id;

        -- Exit loop if the ID is unique
        EXIT WHEN NOT id_exists;
    END LOOP;
    
    RETURN short_id;
END;
$$ LANGUAGE plpgsql;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the contractor table
CREATE TABLE contractor (
    id TEXT DEFAULT short_uuid('contractor') PRIMARY KEY,
    uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at BIGINT DEFAULT utc_now(),
    updated_at BIGINT DEFAULT utc_now(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL
);

-- Create the document types enum
CREATE TYPE document_type AS ENUM (
    'Public Liability',
    'Workers Compensation',
    'Contractor Insurance',
    'Personal Indemnity'
);

-- Create the document statuses enum
CREATE TYPE document_status AS ENUM (
    'Active',
    'Expired',
    'Renewed',
    'Review',
    'Rejected'
);

-- Create the document table
DROP TABLE IF EXISTS document;
CREATE TABLE document (
    id TEXT DEFAULT short_uuid('document') PRIMARY KEY,
    uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at BIGINT DEFAULT utc_now(),
    updated_at BIGINT DEFAULT utc_now(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    policy_number TEXT NOT NULL,
    expiry_date BIGINT NOT NULL,
    status document_status NOT NULL,
    type document_type NOT NULL,
    contractor_id TEXT NOT NULL REFERENCES contractor(id) ON DELETE CASCADE
);

-- Create the company table
CREATE TABLE company (
    id TEXT DEFAULT short_uuid('company') PRIMARY KEY,
    uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at BIGINT DEFAULT utc_now(),
    updated_at BIGINT DEFAULT utc_now(),
    business_phone TEXT NOT NULL,
    business_email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- Create the employee table
CREATE TABLE employee (
    id TEXT DEFAULT short_uuid('employee') PRIMARY KEY,
    uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    created_at BIGINT DEFAULT utc_now(),
    updated_at BIGINT DEFAULT utc_now(),
    UNIQUE (uid, company_id) -- Ensures a user can't have duplicate records for the same company
);

-- Create the junction table for companies and contractors (many-to-many)
CREATE TABLE company_contractor (
    company_id TEXT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    contractor_id TEXT NOT NULL REFERENCES contractor(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, contractor_id)
);

ALTER TABLE contractor ENABLE ROW LEVEL SECURITY;
ALTER TABLE document ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

ALTER TABLE company_contractor ENABLE ROW LEVEL SECURITY;

-- Select policies
-- CREATE POLICY "Allow contractors to view their own records"
-- ON contractor
-- FOR SELECT
-- USING (uid = auth.uid());

CREATE POLICY "Allow contractors to view comapnies they are part of"
ON company
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM company_contractor cc, contractor c
        WHERE cc.contractor_id = c.id
        AND c.uid = auth.uid()
        AND cc.company_id = company.id
    )
);

CREATE POLICY "Employees can view their own records"
ON employee
FOR SELECT
USING (uid = auth.uid());

-- CREATE POLICY "Employees can view their own company's contractors"
-- ON contractor
-- FOR SELECT
-- USING (
--     EXISTS (
--         SELECT 1
--         FROM employee e, contractor c, company_contractor cc
--         WHERE e.uid = auth.uid()
--         AND e.company_id = cc.company_id
--         AND cc.contractor_id = c.id
--     )
-- );

CREATE POLICY "Employees can view their own company's document"
ON document
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM employee e, document d, contractor c, company_contractor cc
        WHERE e.uid = auth.uid()
        AND e.company_id = cc.company_id
        AND cc.contractor_id = c.id
        AND c.id = d.contractor_id
    )
);

CREATE POLICY "Employees can view their own company"
ON company
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM employee e
        WHERE e.uid = auth.uid()
        AND e.company_id = company.id
    )
);

-- Insert policies
CREATE POLICY "Allow user to insert their own contractors"
ON contractor
FOR INSERT
WITH CHECK (uid = auth.uid());

CREATE POLICY "Allow user to insert their own document"
ON document
FOR INSERT
WITH CHECK (uid = auth.uid());

CREATE POLICY "Allow user to insert their own companies"
ON company
FOR INSERT
WITH CHECK (uid = auth.uid());

-- update policies
-- CREATE POLICY "Allow user to update their own contractor"
-- ON contractor
-- FOR UPDATE
-- USING (uid = auth.uid());


CREATE POLICY "Employees can update document of their company's contractors"
ON document
FOR UPDATE
USING (
    EXISTS (
        SELECT 1
        FROM company_contractor cc
        JOIN employee e ON cc.company_id = e.company_id
        WHERE cc.contractor_id = document.contractor_id
        AND e.uid = auth.uid()
    )
);


CREATE POLICY "Allow user to update their own document"
ON document
FOR UPDATE
USING (uid = auth.uid());

-- delete policies
-- users can't delete contractor
-- users can't delete document
-- users can't delete employee
-- users can't delete company
