export interface Patient {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  patient: Patient;
  token: string;
}
