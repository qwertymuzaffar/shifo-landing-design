export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  clinic_id?: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  doctor?: {
    first_name: string;
    last_name: string;
    specialization: string;
  };
  clinic?: {
    name: string;
    address: string;
  };
}

export interface CreateAppointmentRequest {
  doctor_id: string;
  clinic_id?: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}
