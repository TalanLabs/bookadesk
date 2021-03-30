create table places
(
    id varchar not null
        constraint places_pk
            primary key,
    num varchar not null,
    office_id varchar,
    floor_id varchar,
    left_pos numeric,
    top_pos numeric,
    room varchar,
    neighbours character varying[],
    group_id uuid
);

create unique index places_id_uindex
    on places (id);

create table bookings
(
    id varchar not null
        constraint bookings_pk
            primary key,
    date varchar not null,
    email varchar not null,
    place_id varchar not null,
    confirmed boolean default false
);

create unique index bookings_id_uindex
    on bookings (id);

create table offices
(
    id varchar,
    name varchar,
    description varchar
);

create table floors
(
    id varchar,
    name varchar,
    office_id varchar
);

