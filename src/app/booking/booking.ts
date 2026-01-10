import {Component, signal, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClinicService} from '../core/services/clinic.service';
import {BookingService} from '../core/services/booking.service';
import {Clinic} from '../core/models/clinic.model';
import {BookingRequest} from '../core/models/booking.model';
import {firstValueFrom} from 'rxjs';

import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {
    LucideAngularModule,
    Calendar,
    Clock,
    MapPin,
    Building2,
    User,
    Phone,
    Mail,
    ArrowLeft,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-angular';

interface FormData {
    name: string;
    phone: string;
    email: string;
    notes: string;
}

@Component({
    selector: 'app-booking',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './booking.html',
    styleUrl: './booking.scss',
})
export class Booking implements OnInit {
    private clinicService = inject(ClinicService);
    private bookingService = inject(BookingService);

    readonly Calendar = Calendar;
    readonly Clock = Clock;
    readonly MapPin = MapPin;
    readonly Building2 = Building2;
    readonly User = User;
    readonly Phone = Phone;
    readonly Mail = Mail;
    readonly ArrowLeft = ArrowLeft;
    readonly Search = Search;
    readonly ChevronLeft = ChevronLeft;
    readonly ChevronRight = ChevronRight;

    selectedClinic = signal<string>('');
    selectedDate = signal<string>('');
    selectedTime = signal<string>('');
    searchQuery = signal<string>('');
    currentWeekOffset = signal<number>(0);
    isSubmitted = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    submitError = signal<string>('');

    bookingForm: FormGroup;

    formData = signal<FormData>({
        name: '',
        phone: '',
        email: '',
        notes: ''
    });

    clinics = signal<Clinic[]>([]);
    isLoadingClinics = signal<boolean>(false);
    clinicError = signal<string>('');


    readonly timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    filteredClinics = computed(() => {
        const query = this.searchQuery().toLowerCase();
        const allClinics = this.clinics();
        return allClinics.filter(clinic =>
            clinic.name.toLowerCase().includes(query) ||
            clinic.address.toLowerCase().includes(query)
        );
    });


    weekDays = computed(() => this.getCurrentWeek());

    selectedClinicData = computed(() =>
        this.clinics().find(c => c.id === this.selectedClinic())
    );


    constructor(private router: Router, private fb: FormBuilder) {
        this.bookingForm = this.fb.group({
            name: ['', Validators.required],
            phone: ['', Validators.required],
            email: [''],
            notes: ['']
        });
    }

    ngOnInit() {
        this.fetchClinics();
    }

    async fetchClinics() {
        this.isLoadingClinics.set(true);
        this.clinicError.set('');
        try {
            const data = await firstValueFrom(this.clinicService.getClinics('ru'));
            this.clinics.set(data);
        } catch (error: any) {
            console.error('Error fetching clinics:', error);
            this.clinicError.set('Не удалось загрузить список клиник. Пожалуйста, попробуйте позже.');
        } finally {
            this.isLoadingClinics.set(false);
        }
    }


    getCurrentWeek(): Date[] {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        monday.setDate(monday.getDate() + (this.currentWeekOffset() * 7));

        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            week.push(date);
        }
        return week;
    }

    goToPreviousWeek() {
        this.currentWeekOffset.update(v => v - 1);
    }

    goToNextWeek() {
        this.currentWeekOffset.update(v => v + 1);
    }

    goToCurrentWeek() {
        this.currentWeekOffset.set(0);
    }

    getWeekRange(): string {
        const week = this.getCurrentWeek();
        const start = week[0];
        const end = week[6];
        return `${start.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        })} - ${end.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', year: 'numeric'})}`;
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit'});
    }

    getDayName(date: Date): string {
        const dayName = date.toLocaleDateString('ru-RU', {weekday: 'short'});
        return dayName.slice(0, 2);
    }

    isToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isPastDate(date: Date): boolean {
        return date < new Date(new Date().setHours(0, 0, 0, 0));
    }

    selectClinic(clinicId: string) {
        this.selectedClinic.set(clinicId);
        this.searchQuery.set('');
    }

    selectDate(date: Date) {
        if (!this.isPastDate(date)) {
            this.selectedDate.set(date.toISOString().split('T')[0]);
        }
    }

    selectTime(time: string) {
        if (this.selectedDate()) {
            this.selectedTime.set(time);
        }
    }

    async handleSubmit(event: Event) {
        event.preventDefault();

        if (!this.selectedClinic()) {
            alert('Пожалуйста, выберите клинику');
            return;
        }

        if (!this.selectedDate()) {
            alert('Пожалуйста, выберите дату');
            return;
        }

        if (!this.selectedTime()) {
            alert('Пожалуйста, выберите время');
            return;
        }

        if (this.bookingForm.invalid) {
            this.bookingForm.markAllAsTouched();
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        this.isSubmitting.set(true);
        this.submitError.set('');

        const bookingData: BookingRequest = {
            clinic_id: this.selectedClinic(),
            date: this.selectedDate(),
            time: this.selectedTime(),
            ...this.bookingForm.value
        };

        try {
            await firstValueFrom(this.bookingService.createBooking(bookingData, 'ru'));
            this.formData.set(this.bookingForm.value);
            this.isSubmitted.set(true);
        } catch (error: any) {
            console.error('Booking submission error:', error);
            this.submitError.set(error.error?.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте еще раз.');
            alert(this.submitError());
        } finally {
            this.isSubmitting.set(false);
        }
    }

    onBack() {
        this.router.navigate(['/']);
    }
}
