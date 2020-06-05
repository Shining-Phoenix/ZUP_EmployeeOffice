-- Structure for table users (OID = 16589):
SET SESSION AUTHORIZATION 'postgres';
SET search_path = public, pg_catalog;
CREATE TABLE users (
    surname varchar(50),
    user_name varchar(50),
    patronymic varchar(50),
    id_1c varchar(36),
    pk integer DEFAULT nextval('users_pk_seq'::regclass) NOT NULL,
    email varchar(100) NOT NULL,
    user_password varchar(100),
    image_src varchar(200),
    base_pk integer DEFAULT 0 NOT NULL
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
    AS '', '
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
    AS '', '
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
-- Definition for sequence inquiryRequestStatus_pk_seq (OID = 90309):
CREATE SEQUENCE "inquiryRequestStatus_pk_seq"
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table inquiry_request_status (OID = 90311):
CREATE TABLE inquiry_request_status (
    pk integer DEFAULT nextval('"inquiryRequestStatus_pk_seq"'::regclass) NOT NULL,
    status varchar(30),
    disabled_on_web boolean DEFAULT false NOT NULL
) WITHOUT OIDS;
-- Definition for sequence inquiry_request_type_pk_seq (OID = 90326):
CREATE SEQUENCE inquiry_request_type_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table inquiry_request_type (OID = 90328):
CREATE TABLE inquiry_request_type (
    pk integer DEFAULT nextval('inquiry_request_type_pk_seq'::regclass) NOT NULL,
    type_name varchar(30) NOT NULL,
    id_1c varchar(36) NOT NULL,
    base_pk integer DEFAULT 0 NOT NULL,
    deleted boolean NOT NULL
) WITHOUT OIDS;
-- Definition for sequence inquiry_request_pk_seq (OID = 90338):
CREATE SEQUENCE inquiry_request_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table inquiry_request (OID = 90340):
CREATE TABLE inquiry_request (
    pk integer DEFAULT nextval('inquiry_request_pk_seq'::regclass) NOT NULL,
    doc_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_pk integer NOT NULL,
    status_pk integer NOT NULL,
    type_pk integer NOT NULL,
    doc_number varchar(20),
    description varchar(1000),
    deleted boolean DEFAULT false NOT NULL
) WITHOUT OIDS;
-- Definition for sequence exchange_pk_seq (OID = 98504):
CREATE SEQUENCE exchange_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table exchange (OID = 98506):
CREATE TABLE exchange (
    pk integer DEFAULT nextval('exchange_pk_seq'::regclass) NOT NULL,
    ex_type varchar(50) NOT NULL,
    ex_data varchar NOT NULL,
    event_pk integer NOT NULL,
    ex_date timestamp without time zone NOT NULL,
    base_pk integer NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
) WITHOUT OIDS;
-- Definition for sequence exchange_event_pk_seq (OID = 98515):
CREATE SEQUENCE exchange_event_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table exchange_event (OID = 98517):
CREATE TABLE exchange_event (
    pk integer DEFAULT nextval('exchange_event_pk_seq'::regclass) NOT NULL,
    event_name varchar(30) NOT NULL
) WITHOUT OIDS;
-- Definition for sequence work_schedule_pk_seq (OID = 114882):
CREATE SEQUENCE work_schedule_pk_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table tabel_work_schedule (OID = 114884):
CREATE TABLE tabel_work_schedule (
    pk integer DEFAULT nextval('work_schedule_pk_seq'::regclass) NOT NULL,
    emloyee_id_1c varchar(36) NOT NULL,
    work_date date NOT NULL,
    work_hour real DEFAULT 0 NOT NULL,
    types_of_time_pk integer NOT NULL,
    base_pk integer
) WITHOUT OIDS;
-- Definition for sequence TypesOfTime_pk_seq (OID = 114891):
CREATE SEQUENCE "TypesOfTime_pk_seq"
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 2147483647
    NO MINVALUE
    CACHE 1;
-- Structure for table types_of_time (OID = 114893):
CREATE TABLE types_of_time (
    pk integer DEFAULT nextval('"TypesOfTime_pk_seq"'::regclass) NOT NULL,
    time_name varchar(50),
    id_1c varchar(36),
    time_kod varchar(3),
    base_pk integer,
    deleted boolean DEFAULT false NOT NULL,
    general_time_id_ic varchar(36),
    time_name_id varchar(50)
) WITHOUT OIDS;
-- Structure for table work_schedules (OID = 123078):
CREATE TABLE work_schedules (
    id_1c varchar(36) NOT NULL,
    base_pk integer NOT NULL,
    title varchar(100)
) WITHOUT OIDS;
-- Structure for table general_work_schedules_data (OID = 123083):
CREATE TABLE general_work_schedules_data (
    base_pk integer NOT NULL,
    work_schedule_id_1c varchar(36) NOT NULL,
    work_date date NOT NULL,
    types_of_time_id_1c varchar(36) NOT NULL,
    work_hour real
) WITHOUT OIDS;
-- Structure for table personal_work_schedules_data (OID = 123088):
CREATE TABLE personal_work_schedules_data (
    base_pk integer NOT NULL,
    employee_id_1c varchar(36) NOT NULL,
    work_date date NOT NULL,
    types_of_time_id_1c varchar(36) NOT NULL,
    work_hour real
) WITHOUT OIDS;
-- Structure for table employee_work_schedules (OID = 123093):
CREATE TABLE employee_work_schedules (
    employee_id_1c varchar(36) NOT NULL,
    base_pk integer NOT NULL,
    date_from date NOT NULL,
    date_to date,
    work_schedules_id_1c varchar(36)
) WITHOUT OIDS;
--
-- Data for blobs (OID = 90311) (LIMIT 0,5)
--
INSERT INTO inquiry_request_status (pk, status, disabled_on_web) VALUES (3, 'В работе', true);
INSERT INTO inquiry_request_status (pk, status, disabled_on_web) VALUES (4, 'Отменена', true);
INSERT INTO inquiry_request_status (pk, status, disabled_on_web) VALUES (2, 'Отправлена  в 1С', true);
INSERT INTO inquiry_request_status (pk, status, disabled_on_web) VALUES (5, 'Выполнена', true);
INSERT INTO inquiry_request_status (pk, status, disabled_on_web) VALUES (1, 'Новая', false);
COMMIT;
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
-- Definition for index inquiryRequestStatus_pkey (OID = 90315):
ALTER TABLE ONLY inquiry_request_status
    ADD CONSTRAINT "inquiryRequestStatus_pkey" PRIMARY KEY (pk);
-- Definition for index inquiry_request_type_pkey (OID = 90332):
ALTER TABLE ONLY inquiry_request_type
    ADD CONSTRAINT inquiry_request_type_pkey PRIMARY KEY (pk);
-- Definition for index inquiryRequest_pkey (OID = 90345):
ALTER TABLE ONLY inquiry_request
    ADD CONSTRAINT "inquiryRequest_pkey" PRIMARY KEY (pk);
-- Definition for index exchange_pkey (OID = 98513):
ALTER TABLE ONLY exchange
    ADD CONSTRAINT exchange_pkey PRIMARY KEY (pk);
-- Definition for index exchange_event_pkey (OID = 98521):
ALTER TABLE ONLY exchange_event
    ADD CONSTRAINT exchange_event_pkey PRIMARY KEY (pk);
-- Definition for index Foreign_key_exchange__exchange_event (OID = 98523):
ALTER TABLE ONLY exchange
    ADD CONSTRAINT "Foreign_key_exchange__exchange_event" FOREIGN KEY (event_pk) REFERENCES exchange_event(pk) ON UPDATE CASCADE ON DELETE RESTRICT;
-- Definition for index work_schedule_pkey (OID = 114889):
ALTER TABLE ONLY tabel_work_schedule
    ADD CONSTRAINT work_schedule_pkey PRIMARY KEY (pk);
-- Definition for index TypesOfTime_pkey (OID = 114897):
ALTER TABLE ONLY types_of_time
    ADD CONSTRAINT "TypesOfTime_pkey" PRIMARY KEY (pk);
-- Definition for index work_schedules_Index01 (OID = 123081):
ALTER TABLE ONLY work_schedules
    ADD CONSTRAINT "work_schedules_Index01" PRIMARY KEY (base_pk, id_1c);
-- Definition for index genera-work schedules-data_Index01 (OID = 123086):
ALTER TABLE ONLY general_work_schedules_data
    ADD CONSTRAINT "genera-work schedules-data_Index01" PRIMARY KEY (base_pk, work_schedule_id_1c, work_date, types_of_time_id_1c);
-- Definition for index personal-work schedules-data_Index01 (OID = 123091):
ALTER TABLE ONLY personal_work_schedules_data
    ADD CONSTRAINT "personal-work schedules-data_Index01" PRIMARY KEY (base_pk, employee_id_1c, work_date, types_of_time_id_1c);
-- Definition for index employee_work_schedules_Index01 (OID = 123096):
ALTER TABLE ONLY employee_work_schedules
    ADD CONSTRAINT "employee_work_schedules_Index01" PRIMARY KEY (base_pk, employee_id_1c, date_from);
SET search_path = pg_catalog, pg_catalog;
COMMENT ON SCHEMA public IS 'standard public schema';
