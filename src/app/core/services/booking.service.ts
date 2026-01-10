import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BookingRequest} from '../models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private http = inject(HttpClient);

    createBooking(data: BookingRequest, lang: 'ru' | 'en' = 'ru'): Observable<any> {
        return this.http.post('/public/forms/booking', data, {
            params: {lang}
        });
    }
}
