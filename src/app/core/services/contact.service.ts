import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ContactFormData} from '../models/contact.model';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);

    sendContactForm(data: ContactFormData, lang: 'ru' | 'en' = 'ru'): Observable<any> {
        return this.http.post('/public/forms/contact', data, {
            params: {lang}
        });
    }
}

