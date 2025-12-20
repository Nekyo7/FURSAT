-- Create a function to check email domain
-- We use public schema for the function so it's accessible
CREATE OR REPLACE FUNCTION public.check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email ends with @bmsit.in (case-insensitive)
  IF NOT NEW.email ILIKE '%@bmsit.in' THEN
    RAISE EXCEPTION 'Only @bmsit.in emails are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
-- We drop it first to ensure idempotency
DROP TRIGGER IF EXISTS ensure_bmsit_email ON auth.users;

CREATE TRIGGER ensure_bmsit_email
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_email_domain();
