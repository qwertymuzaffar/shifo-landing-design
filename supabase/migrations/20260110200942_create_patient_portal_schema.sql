/*
  # Patient Portal Database Schema

  ## Overview
  This migration creates the complete database structure for the patient portal including:
  - Patients management
  - Doctors and their specializations
  - Appointments booking system
  - Patient documents storage

  ## New Tables
  
  ### 1. `patients`
  Patient information and credentials
  - `id` (uuid, primary key)
  - `email` (text, unique) - Patient email/login
  - `phone` (text, unique) - Patient phone number
  - `password_hash` (text) - Hashed password
  - `first_name` (text) - Patient first name
  - `last_name` (text) - Patient last name
  - `date_of_birth` (date) - Patient date of birth
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `doctors`
  Doctor information
  - `id` (uuid, primary key)
  - `first_name` (text) - Doctor first name
  - `last_name` (text) - Doctor last name
  - `specialization` (text) - Medical specialization
  - `clinic_id` (uuid, foreign key) - Reference to clinic
  - `phone` (text) - Doctor phone number
  - `email` (text) - Doctor email
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `appointments`
  Patient appointments
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key) - Reference to patient
  - `doctor_id` (uuid, foreign key) - Reference to doctor
  - `clinic_id` (uuid, foreign key) - Reference to clinic
  - `appointment_date` (date) - Appointment date
  - `appointment_time` (time) - Appointment time
  - `status` (text) - Status: pending, confirmed, completed, cancelled
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `patient_documents`
  Patient medical documents
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key) - Reference to patient
  - `document_type` (text) - Type of document
  - `document_name` (text) - Document name
  - `document_url` (text) - URL to document file
  - `uploaded_at` (timestamptz) - Upload timestamp
  - `notes` (text) - Additional notes

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Patients can only view/edit their own data
  - Doctors information is readable by authenticated patients
  - Appointments are accessible only to the related patient
  - Documents are accessible only to the document owner
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  specialization text NOT NULL,
  clinic_id uuid,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create patient_documents table
CREATE TABLE IF NOT EXISTS patient_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_name text NOT NULL,
  document_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  notes text
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Patients can view own profile"
  ON patients FOR SELECT
  TO authenticated
  USING (id = (current_setting('app.current_patient_id', true))::uuid);

CREATE POLICY "Patients can update own profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (id = (current_setting('app.current_patient_id', true))::uuid)
  WITH CHECK (id = (current_setting('app.current_patient_id', true))::uuid);

-- RLS Policies for doctors table
CREATE POLICY "Authenticated users can view doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for appointments table
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = (current_setting('app.current_patient_id', true))::uuid);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = (current_setting('app.current_patient_id', true))::uuid);

CREATE POLICY "Patients can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (patient_id = (current_setting('app.current_patient_id', true))::uuid)
  WITH CHECK (patient_id = (current_setting('app.current_patient_id', true))::uuid);

CREATE POLICY "Patients can cancel own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (patient_id = (current_setting('app.current_patient_id', true))::uuid);

-- RLS Policies for patient_documents table
CREATE POLICY "Patients can view own documents"
  ON patient_documents FOR SELECT
  TO authenticated
  USING (patient_id = (current_setting('app.current_patient_id', true))::uuid);

-- Insert test data
-- Test patient with login: admin, password: admin (password_hash is bcrypt hash of 'admin')
INSERT INTO patients (email, phone, password_hash, first_name, last_name, date_of_birth)
VALUES 
  ('admin@clinic.com', '+998901234567', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'Patient', '1990-01-01')
ON CONFLICT (email) DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, specialization, phone, email)
VALUES 
  ('Alisher', 'Karimov', 'Терапевт', '+998901111111', 'karimov@clinic.com'),
  ('Dilnoza', 'Rashidova', 'Кардиолог', '+998902222222', 'rashidova@clinic.com'),
  ('Sherzod', 'Mahmudov', 'Хирург', '+998903333333', 'mahmudov@clinic.com'),
  ('Nilufar', 'Azimova', 'Невролог', '+998904444444', 'azimova@clinic.com')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_id ON patient_documents(patient_id);