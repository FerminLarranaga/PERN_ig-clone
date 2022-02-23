create database ig_clone;

create extension if not exists "uuid-ossp";

create table users(
    id uuid default uuid_generate_v4 (),
    username varchar(100) unique not null,
    full_name varchar(100) not null,
    description text,
    web_site varchar(255),
    profile_pic text,
    total_posts smallint default 0,
    total_followers smallint default 0,
    total_followed smallint default 0,
    hash varchar(100) not null,
    constraint positive_posts check (total_posts >= 0),
    constraint positive_followers check (total_followers >= 0),
    constraint positive_followed check (total_followed >= 0),
    constraint min_length_fullName check (length(full_name) >= 4),
    constraint min_length_username check (length(username) >= 4),
    primary key (id)
);

create table posts(
    id uuid default uuid_generate_v4 (),
    caption text,
    image_url text not null,
    user_id uuid not null,
    post_date timestamp not null,
    file_format varchar(3) not null,
    vid_duration decimal,
    primary key (id),
    foreign key (user_id) references users (id)
);

create table comments(
    id uuid default uuid_generate_v4 (),
    comment text not null,
    user_id uuid not null,
    post_id uuid not null,
    comment_date timestamp not null,
    primary key (id),
    foreign key (user_id) references users(id),
    foreign key (post_id) references posts(id)
);

create table followed(
    id uuid unique,
    follower uuid not null,
    following uuid not null,
    primary key (id),
    foreign key (follower) references users(id),
    foreign key (following) references users(id)
);

ALTER TABLE comments ADD COLUMN comment_data timestamp;
ALTER TABLE comments ALTER COLUMN comment_data SET NOT NULL;