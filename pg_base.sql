
--\connect - postgres
-- CREATE DATABASE "ZUP_EmployeeOffice" WITH TEMPLATE = template0 ENCODING = 6 TABLESPACE = pg_default;
--\connect "ZUP_EmployeeOffice" postgres

SET search_path = public, pg_catalog;
-- Definition for sequence users_pk_seq (OID = 16653):
CREATE SEQUENCE users_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Definition for sequence user_groups_pk_seq (OID = 16668):
CREATE SEQUENCE user_groups_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table users (OID = 16589):
CREATE TABLE users (
    surname varchar(50),
    user_name varchar(50),
    patronymic varchar(50),
    id_1c varchar(36),
    pk integer DEFAULT nextval('users_pk_seq'::regclass) NOT NULL,
    email varchar(100) NOT NULL,
    user_password varchar(100),
    image_src varchar(200),
    base_pk integer
) WITHOUT OIDS;
-- Structure for table user_groups (OID = 16594):
CREATE TABLE user_groups (
    group_name varchar(50),
    pk integer DEFAULT nextval('user_groups_pk_seq'::regclass) NOT NULL
) WITHOUT OIDS;
-- Structure for table users_groups (OID = 16599):
CREATE TABLE users_groups (
    group_pk integer NOT NULL,
    user_pk integer NOT NULL
) WITHOUT OIDS;
-- Structure for table employee_position (OID = 24764):
CREATE TABLE employee_position (
    position_name varchar(200),
    pk varchar(36) NOT NULL,
    base_pk integer NOT NULL
) WITHOUT OIDS;
-- Structure for table subdivision (OID = 24772):
CREATE TABLE subdivision (
    subdivision_name varchar(200),
    pk varchar(36) NOT NULL,
    parent_pk varchar(36),
    organization_pk varchar(36),
    base_pk integer
) WITHOUT OIDS;
-- Structure for table workplace (OID = 24780):
CREATE TABLE workplace (
    position_pk varchar(36) NOT NULL,
    subdivision_pk varchar(36) NOT NULL,
    employee_pk varchar(36) NOT NULL,
    date_from timestamp without time zone NOT NULL,
    base_pk integer NOT NULL
) WITHOUT OIDS;
-- Structure for table organization (OID = 32977):
CREATE TABLE organization (
    organization_name varchar(200) NOT NULL,
    pk varchar(36) NOT NULL,
    base_pk integer
) WITHOUT OIDS;
-- Structure for table employee (OID = 49340):
CREATE TABLE employee (
    pk varchar(36) NOT NULL,
    base_pk integer NOT NULL,
    user_id_1c varchar(36) NOT NULL
) WITHOUT OIDS;
-- Definition for function InsertUpdateOrganisation (OID = 49355):
SET check_function_bodies = false;
CREATE FUNCTION "InsertUpdateOrganisation" (_organization_name varchar, _pk varchar, res_pk integer) RETURNS varchar
    AS '
begin

SELECT pk into res_pk FROM organization Where organization.pk = _pk;
IF NOT FOUND THEN
   INSERT INTO organization(organization_name, pk, base_pk) VALUES( _organization_name, _pk, _base_pk ) RETURNING pk into res_pk;
ELSE
   UPDATE organization SET organization_name = _organization_name, pk = _pk, base_pk = _base_pk WHERE pk = res_pk;
END IF;   
  
end
'
    LANGUAGE plpgsql;
-- Definition for function InsertUpdateSubdivision (OID = 49356):
CREATE FUNCTION "InsertUpdateSubdivision" (_subdivision_name varchar, _pk varchar, _parent_pk varchar, _organization_pk varchar, res_pk integer) RETURNS varchar
    AS '
begin

SELECT pk into res_pk FROM subdivision Where subdivision.pk = _pk;
IF NOT FOUND THEN
   INSERT INTO subdivision(subdivision_name, pk, parent_pk, organization_pk, base_pk) VALUES( _subdivision_name, _pk, _parent_pk, _organization_pk, _base_pk ) RETURNING pk into res_pk;
ELSE
   UPDATE subdivision SET subdivision_name = _subdivision_name, pk = _pk, parent_pk = _parent_pk, organization_pk = _organization_pk, base_pk = _base_pk WHERE pk =_pk;
END IF;   
  
end
'
    LANGUAGE plpgsql;
-- Structure for table payment_list (OID = 65722):
CREATE TABLE payment_list (
    payment_month date NOT NULL,
    employee_pk varchar(36) NOT NULL,
    base_pk integer NOT NULL,
    payment_position varchar(200) NOT NULL,
    payment_sum real,
    payment_group varchar(100) NOT NULL,
    payment_group_id integer
) WITHOUT OIDS;
-- Definition for index users_email_uniq (OID = 16695):
CREATE UNIQUE INDEX users_email_uniq ON public.users USING btree (email);
-- Definition for index users_id_1c_uniq (OID = 16697):
CREATE UNIQUE INDEX users_id_1c_uniq ON public.users USING btree (id_1c);
-- Definition for index users_pkey (OID = 16656):
ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (pk);
-- Definition for index users_groups_pkey (OID = 16674):
ALTER TABLE ONLY users_groups
    ADD CONSTRAINT users_groups_pkey PRIMARY KEY (user_pk);
-- Definition for index user_groups_pkey (OID = 16681):
ALTER TABLE ONLY user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (pk);
-- Definition for index Foreign_users_groups__users_groups (OID = 16683):
ALTER TABLE ONLY users_groups
    ADD CONSTRAINT "Foreign_users_groups__users_groups" FOREIGN KEY (group_pk) REFERENCES user_groups(pk) ON UPDATE CASCADE ON DELETE CASCADE;
-- Definition for index Foreign_users_groups__users (OID = 16688):
ALTER TABLE ONLY users_groups
    ADD CONSTRAINT "Foreign_users_groups__users" FOREIGN KEY (user_pk) REFERENCES users(pk) ON UPDATE CASCADE ON DELETE CASCADE;
-- Definition for index subdivision_pkey (OID = 41162):
ALTER TABLE ONLY subdivision
    ADD CONSTRAINT subdivision_pkey PRIMARY KEY (pk);
-- Definition for index employee_position_pkey (OID = 41164):
ALTER TABLE ONLY employee_position
    ADD CONSTRAINT employee_position_pkey PRIMARY KEY (pk);
-- Definition for index organization_pkey (OID = 41166):
ALTER TABLE ONLY organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (pk);
-- Definition for index pk_base_pk__pk (OID = 49359):
ALTER TABLE ONLY employee
    ADD CONSTRAINT pk_base_pk__pk PRIMARY KEY (base_pk, pk);
-- Definition for index pk_base_pk__employee_pk__date_from (OID = 57538):
ALTER TABLE ONLY workplace
    ADD CONSTRAINT pk_base_pk__employee_pk__date_from PRIMARY KEY (base_pk, employee_pk, date_from);
-- Definition for index pk_payment_list (OID = 65737):
ALTER TABLE ONLY payment_list
    ADD CONSTRAINT pk_payment_list PRIMARY KEY (base_pk, employee_pk, payment_month, payment_position, payment_group);
COMMENT ON SCHEMA public IS 'standard public schema';


