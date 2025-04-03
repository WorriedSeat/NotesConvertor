--the following code should be ran only once for creration of database tables

create table task(
    id serial primary key,
    img bytea not null,
    result_text text,
    created_at timestamp with time zone not null
);

create table survey(
    id serial primary key,
    success boolean not null,
    amount_mistakes int not null default 0,
    rewrite_session_id serial references task(id)
);
