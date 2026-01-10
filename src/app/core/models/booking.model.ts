export interface BookingRequest {
    clinic_id: string;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;
}
