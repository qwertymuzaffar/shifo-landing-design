import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Doctor} from '../models/doctor.model';

const MOCK_DOCTORS: Doctor[] = [
    {id: 'd1', first_name: 'Алишер',  last_name: 'Каримов',   specialization: 'Терапевт',     created_at: ''},
    {id: 'd2', first_name: 'Дилноза', last_name: 'Рашидова',  specialization: 'Кардиолог',    created_at: ''},
    {id: 'd3', first_name: 'Шерзод',  last_name: 'Махмудов',  specialization: 'Хирург',       created_at: ''},
    {id: 'd4', first_name: 'Нилуфар', last_name: 'Азимова',   specialization: 'Невролог',     created_at: ''},
    {id: 'd5', first_name: 'Малика',  last_name: 'Сатторова', specialization: 'Дерматолог',   created_at: ''},
    {id: 'd6', first_name: 'Джамшед', last_name: 'Ахмедов',   specialization: 'Педиатр',      created_at: ''},
    {id: 'd7', first_name: 'Зарина',  last_name: 'Холова',    specialization: 'Эндокринолог', created_at: ''},
];

@Injectable({providedIn: 'root'})
export class DoctorService {
    /**
     * Mock implementation. To be swapped with real HTTP call:
     *   return this.http.post('/public/forms/clinics/:id/doctors', ...);
     *
     * Demo behavior: clinic IDs ending in '3' return an empty array
     * so the booking page can demonstrate the "no doctors" path.
     */
    getDoctorsByClinic(clinicId: string, _lang: 'ru' | 'en' = 'ru'): Observable<Doctor[]> {
        if (!clinicId) return of([]);
        if (clinicId.endsWith('3')) {
            return of([]).pipe(delay(250));
        }
        // Pseudo-random subset based on clinic id length
        const count = 3 + (clinicId.length % 4);
        return of(MOCK_DOCTORS.slice(0, count).map(d => ({...d, clinic_id: clinicId}))).pipe(delay(300));
    }
}
