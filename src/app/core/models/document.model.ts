export interface PatientDocument {
  id: string;
  patient_id: string;
  document_type: string;
  document_name: string;
  document_url: string;
  uploaded_at: string;
  notes?: string;
}
