-- Add bio column to profiles table if it doesn't exist
alter table "public"."profiles" add column if not exists "bio" text;

