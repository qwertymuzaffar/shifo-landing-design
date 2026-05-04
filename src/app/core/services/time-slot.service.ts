import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface TimeSlot {
    time: string;
    available: boolean;
}

@Injectable({providedIn: 'root'})
export class TimeSlotService {
    private readonly ALL_SLOTS = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    /**
     * Mock implementation. To be swapped with real HTTP call:
     *   return this.http.get('/public/forms/availability', { params: { doctor_id, date } })
     *
     * Demo: doctor 'd1' has 09:00, 10:00, 14:00, 16:00 occupied tomorrow.
     */
    getAvailableSlots(doctorId: string | null, date: string): Observable<TimeSlot[]> {
        const occupied = this.computeOccupied(doctorId, date);
        const slots = this.ALL_SLOTS.map(time => ({
            time,
            available: !occupied.has(time)
        }));
        return of(slots).pipe(delay(200));
    }

    private computeOccupied(doctorId: string | null, date: string): Set<string> {
        if (doctorId !== 'd1') return new Set();

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const d = String(tomorrow.getDate()).padStart(2, '0');
        const tomorrowIso = `${y}-${m}-${d}`;

        if (date !== tomorrowIso) return new Set();
        return new Set(['09:00', '10:00', '14:00', '16:00']);
    }
}
