import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Clinic} from '../models/clinic.model';

@Injectable({
    providedIn: 'root'
})
export class ClinicService {
    private http = inject(HttpClient);

    getClinics(lang: 'ru' | 'en' = 'ru'): Observable<Clinic[]> {
        return this.http.post<Clinic[]>('/public/forms/clinics', {}, {
            params: {lang}
        });
    }
}
