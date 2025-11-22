-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix function search_path for is_blacklisted
CREATE OR REPLACE FUNCTION public.is_blacklisted(
  p_id_number TEXT DEFAULT NULL,
  p_plate_number TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.blacklist
    WHERE removed_at IS NULL
    AND (
      (p_id_number IS NOT NULL AND id_number = p_id_number)
      OR (p_plate_number IS NOT NULL AND plate_number = p_plate_number)
    )
  );
END;
$$;