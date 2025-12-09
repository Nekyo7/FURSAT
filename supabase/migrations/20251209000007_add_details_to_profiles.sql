alter table "public"."profiles" add column if not exists "bio" text;
alter table "public"."profiles" add column if not exists "headline" text;
alter table "public"."profiles" add column if not exists "location" text;
alter table "public"."profiles" add column if not exists "website" text;
