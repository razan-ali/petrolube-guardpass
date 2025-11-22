-- Create enum types
CREATE TYPE app_role AS ENUM ('department_admin', 'security_admin');
CREATE TYPE department_type AS ENUM ('shipping', 'raw_material', 'lab', 'coordinator', 'bulk_oil');
CREATE TYPE vehicle_type AS ENUM ('truck', 'car', 'none');
CREATE TYPE truck_operation AS ENUM ('loading', 'unloading', 'both');
CREATE TYPE approval_status AS ENUM ('pending_department', 'pending_security', 'approved', 'rejected');
CREATE TYPE plant_location AS ENUM ('jeddah', 'riyadh');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role app_role NOT NULL,
  department department_type,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create visitor_requests table
CREATE TABLE public.visitor_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Visitor Information
  full_name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  nationality TEXT NOT NULL,
  company_name TEXT NOT NULL,
  department_to_visit department_type NOT NULL,
  purpose_of_visit TEXT NOT NULL,
  
  -- Vehicle Information
  has_vehicle BOOLEAN NOT NULL DEFAULT FALSE,
  vehicle_type vehicle_type,
  plate_number TEXT,
  truck_operation truck_operation,
  
  -- Approval workflow
  status approval_status NOT NULL DEFAULT 'pending_department',
  department_approved_by UUID REFERENCES public.profiles(id),
  department_approved_at TIMESTAMPTZ,
  department_remarks TEXT,
  security_approved_by UUID REFERENCES public.profiles(id),
  security_approved_at TIMESTAMPTZ,
  security_remarks TEXT,
  rejection_reason TEXT,
  rejected_by UUID REFERENCES public.profiles(id),
  rejected_at TIMESTAMPTZ,
  
  -- Additional Security fields
  plant_location plant_location,
  parking_slot_available BOOLEAN,
  visit_start_date DATE,
  visit_end_date DATE,
  
  -- Metadata
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.visitor_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a request
CREATE POLICY "Anyone can submit visitor request"
  ON public.visitor_requests FOR INSERT
  WITH CHECK (true);

-- Department admins can view requests for their department or pending
CREATE POLICY "Department admins view their requests"
  ON public.visitor_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'department_admin'
      AND (
        profiles.department = visitor_requests.department_to_visit
        OR visitor_requests.status IN ('pending_security', 'approved', 'rejected')
      )
    )
  );

-- Security admins can view all requests
CREATE POLICY "Security admins view all requests"
  ON public.visitor_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'security_admin'
    )
  );

-- Department admins can update their department requests
CREATE POLICY "Department admins update requests"
  ON public.visitor_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'department_admin'
      AND profiles.department = visitor_requests.department_to_visit
    )
  );

-- Security admins can update all requests
CREATE POLICY "Security admins update all requests"
  ON public.visitor_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'security_admin'
    )
  );

-- Create request_documents table
CREATE TABLE public.request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.visitor_requests(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'id_document', 'driver_license', 'vehicle_registration', 'driver_photo', 'truck_photo', 'safety_equipment'
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.request_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upload documents"
  ON public.request_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view documents"
  ON public.request_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('department_admin', 'security_admin')
    )
  );

-- Create entry_exit_logs table
CREATE TABLE public.entry_exit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.visitor_requests(id) ON DELETE CASCADE,
  entry_time TIMESTAMPTZ,
  exit_time TIMESTAMPTZ,
  logged_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.entry_exit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Security admins manage entry/exit"
  ON public.entry_exit_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'security_admin'
    )
  );

CREATE POLICY "Department admins view entry/exit"
  ON public.entry_exit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'department_admin'
    )
  );

-- Create delivery_notes table
CREATE TABLE public.delivery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.visitor_requests(id) ON DELETE CASCADE,
  exit_log_id UUID REFERENCES public.entry_exit_logs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.delivery_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Department admins manage delivery notes"
  ON public.delivery_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'department_admin'
    )
  );

CREATE POLICY "Security admins view delivery notes"
  ON public.delivery_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'security_admin'
    )
  );

-- Create blacklist table
CREATE TABLE public.blacklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name TEXT,
  id_number TEXT,
  plate_number TEXT,
  reason TEXT NOT NULL,
  blacklisted_by UUID REFERENCES public.profiles(id),
  blacklisted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMPTZ
);

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Security admins manage blacklist"
  ON public.blacklist FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'security_admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visitor_requests_updated_at
  BEFORE UPDATE ON public.visitor_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_visitor_requests_status ON public.visitor_requests(status);
CREATE INDEX idx_visitor_requests_department ON public.visitor_requests(department_to_visit);
CREATE INDEX idx_request_documents_request_id ON public.request_documents(request_id);
CREATE INDEX idx_entry_exit_logs_request_id ON public.entry_exit_logs(request_id);
CREATE INDEX idx_delivery_notes_request_id ON public.delivery_notes(request_id);
CREATE INDEX idx_blacklist_id_number ON public.blacklist(id_number) WHERE removed_at IS NULL;
CREATE INDEX idx_blacklist_plate_number ON public.blacklist(plate_number) WHERE removed_at IS NULL;

-- Create function to check blacklist
CREATE OR REPLACE FUNCTION public.is_blacklisted(
  p_id_number TEXT DEFAULT NULL,
  p_plate_number TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;