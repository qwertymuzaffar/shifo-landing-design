import {Component, signal, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClinicService} from '../core/services/clinic.service';
import {BookingService} from '../core/services/booking.service';
import {DoctorService} from '../core/services/doctor.service';
import {TimeSlotService, TimeSlot} from '../core/services/time-slot.service';
import {Clinic} from '../core/models/clinic.model';
import {Doctor} from '../core/models/doctor.model';
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
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Pencil,
    Check,
    Loader2,
    FileText,
    Home,
    Stethoscope
} from 'lucide-angular';

type EditingStep = 'clinic' | 'doctor' | null;

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
    private doctorService = inject(DoctorService);
    private timeSlotService = inject(TimeSlotService);

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
    readonly AlertCircle = AlertCircle;
    readonly CheckCircle2 = CheckCircle2;
    readonly Pencil = Pencil;
    readonly Check = Check;
    readonly Loader2 = Loader2;
    readonly FileText = FileText;
    readonly Home = Home;
    readonly Stethoscope = Stethoscope;

    selectedClinic = signal<string>('');
    selectedDoctor = signal<string>('');
    selectedDate = signal<string>('');
    selectedTime = signal<string>('');
    searchQuery = signal<string>('');
    currentMonth = signal<Date>(new Date());
    isSubmitted = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    submitError = signal<string>('');
    validationError = signal<string>('');
    editingStep = signal<EditingStep>(null);

    bookingForm: FormGroup;
    phoneDigits = signal<string>('');

    clinics = signal<Clinic[]>([]);
    isLoadingClinics = signal<boolean>(false);
    clinicError = signal<string>('');

    doctors = signal<Doctor[]>([]);
    isLoadingDoctors = signal<boolean>(false);
    doctorsError = signal<string>('');
    doctorsLoaded = signal<boolean>(false);

    availableSlots = signal<TimeSlot[]>([]);
    isLoadingSlots = signal<boolean>(false);
    slotsError = signal<string>('');

    filteredClinics = computed(() => {
        const query = this.searchQuery().toLowerCase();
        return this.clinics().filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.address.toLowerCase().includes(query)
        );
    });

    calendarDays = computed(() => this.generateCalendarDays());

    selectedClinicData = computed(() =>
        this.clinics().find(c => c.id === this.selectedClinic())
    );

    selectedDoctorData = computed(() =>
        this.doctors().find(d => d.id === this.selectedDoctor())
    );

    /** Doctor step is shown only after the doctors API returns a non-empty list. */
    hasDoctors = computed(() => this.doctorsLoaded() && this.doctors().length > 0);

    isClinicExpanded = computed(() =>
        this.editingStep() === 'clinic' || !this.selectedClinic()
    );

    isDoctorExpanded = computed(() =>
        this.editingStep() === 'doctor' || !this.selectedDoctor()
    );

    isDoctorVisible = computed(() => {
        if (!this.selectedClinic() || this.editingStep() === 'clinic') return false;
        return this.hasDoctors() || this.isLoadingDoctors() || !!this.doctorsError();
    });

    isDateTimeVisible = computed(() => {
        if (!this.selectedClinic() || this.editingStep() === 'clinic') return false;
        if (this.isLoadingDoctors()) return false;
        if (this.hasDoctors()) {
            return !!this.selectedDoctor() && this.editingStep() !== 'doctor';
        }
        // No doctors for this clinic — skip the doctor step entirely
        return this.doctorsLoaded() || !!this.doctorsError();
    });

    isContactVisible = computed(() => this.isDateTimeVisible() && !!this.selectedTime());

    /** Step numbers shift based on whether the doctor step is shown */
    dateStepNumber = computed(() => this.hasDoctors() ? 3 : 2);
    contactStepNumber = computed(() => this.hasDoctors() ? 4 : 3);

    formatSelectedDate(): string {
        if (!this.selectedDate()) return '';
        return new Date(this.selectedDate()).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', weekday: 'short'
        });
    }

    formattedPhone = computed(() => this.formatPhone(this.phoneDigits()));
    isPhoneValid = computed(() => this.phoneDigits().length === 9);

    constructor(private router: Router, private fb: FormBuilder) {
        this.bookingForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            phone: ['', Validators.required],
            email: ['', Validators.email],
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

    // --- Calendar (month grid) ---
    generateCalendarDays(): Array<{date: Date | null, isCurrentMonth: boolean, isToday: boolean, isPast: boolean}> {
        const year = this.currentMonth().getFullYear();
        const month = this.currentMonth().getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days: Array<{date: Date | null, isCurrentMonth: boolean, isToday: boolean, isPast: boolean}> = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({date: null, isCurrentMonth: false, isToday: false, isPast: false});
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            days.push({
                date,
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
                isPast: date < today
            });
        }

        return days;
    }

    previousMonth(): void {
        const current = this.currentMonth();
        this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    }

    nextMonth(): void {
        const current = this.currentMonth();
        this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    }

    goToCurrentMonth(): void {
        this.currentMonth.set(new Date());
    }

    isCurrentMonth(): boolean {
        const now = new Date();
        const cur = this.currentMonth();
        return cur.getFullYear() === now.getFullYear() && cur.getMonth() === now.getMonth();
    }

    getMonthYearLabel(): string {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return `${months[this.currentMonth().getMonth()]} ${this.currentMonth().getFullYear()}`;
    }

    isDateSelected(day: {date: Date | null}): boolean {
        if (!day.date || !this.selectedDate()) return false;
        return this.formatLocalDate(day.date) === this.selectedDate();
    }

    private formatLocalDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    formatDateRu(iso: string): string {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
        });
    }

    // --- Step handlers ---
    selectClinic(clinicId: string) {
        if (this.selectedClinic() !== clinicId) {
            this.selectedClinic.set(clinicId);
            this.selectedDoctor.set('');
            this.selectedDate.set('');
            this.selectedTime.set('');
            this.availableSlots.set([]);
            this.fetchDoctorsFor(clinicId);
        }
        this.editingStep.set(null);
        this.searchQuery.set('');
        this.validationError.set('');
    }

    editClinic() {
        this.editingStep.set('clinic');
    }

    private async fetchDoctorsFor(clinicId: string) {
        this.isLoadingDoctors.set(true);
        this.doctorsError.set('');
        this.doctorsLoaded.set(false);
        this.doctors.set([]);
        try {
            const data = await firstValueFrom(this.doctorService.getDoctorsByClinic(clinicId, 'ru'));
            this.doctors.set(data);
            this.doctorsLoaded.set(true);
        } catch (error: any) {
            console.error('Error fetching doctors:', error);
            this.doctorsError.set('Не удалось загрузить врачей. Попробуйте позже.');
        } finally {
            this.isLoadingDoctors.set(false);
        }
    }

    retryFetchDoctors() {
        if (this.selectedClinic()) {
            this.fetchDoctorsFor(this.selectedClinic());
        }
    }

    selectDoctor(doctorId: string) {
        if (this.selectedDoctor() !== doctorId) {
            this.selectedDoctor.set(doctorId);
            this.selectedDate.set('');
            this.selectedTime.set('');
            this.availableSlots.set([]);
        }
        this.editingStep.set(null);
        this.validationError.set('');
    }

    editDoctor() {
        this.editingStep.set('doctor');
    }

    doctorInitials(d: Doctor): string {
        return ((d.first_name?.charAt(0) || '') + (d.last_name?.charAt(0) || '')).toUpperCase();
    }

    doctorFullName(d: Doctor | undefined): string {
        if (!d) return '';
        return `${d.first_name} ${d.last_name}`.trim();
    }

    selectDate(day: {date: Date | null, isPast: boolean}) {
        if (!day.date || day.isPast) return;
        const dateStr = this.formatLocalDate(day.date);
        this.selectedDate.set(dateStr);
        this.selectedTime.set('');
        this.validationError.set('');
        this.fetchAvailableSlots(dateStr);
    }

    selectTime(slot: TimeSlot) {
        if (!slot.available) return;
        this.selectedTime.set(slot.time);
        this.validationError.set('');
    }

    private async fetchAvailableSlots(date: string) {
        this.isLoadingSlots.set(true);
        this.slotsError.set('');
        this.availableSlots.set([]);
        try {
            const doctorId = this.selectedDoctor() || null;
            const data = await firstValueFrom(this.timeSlotService.getAvailableSlots(doctorId, date));
            this.availableSlots.set(data);
        } catch (error: any) {
            console.error('Error fetching slots:', error);
            this.slotsError.set('Не удалось загрузить доступное время.');
        } finally {
            this.isLoadingSlots.set(false);
        }
    }

    // --- Phone ---
    onPhoneInput(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 9);
        this.phoneDigits.set(digits);
        this.bookingForm.patchValue({phone: digits ? `+992${digits}` : ''});
        this.validationError.set('');
    }

    private formatPhone(digits: string): string {
        if (!digits) return '';
        const parts: string[] = [];
        if (digits.length > 0) parts.push(digits.slice(0, 2));
        if (digits.length > 2) parts.push(digits.slice(2, 5));
        if (digits.length > 5) parts.push(digits.slice(5, 7));
        if (digits.length > 7) parts.push(digits.slice(7, 9));
        return parts.join(' ');
    }

    // --- Submit ---
    async handleSubmit(event: Event) {
        event.preventDefault();
        this.validationError.set('');
        this.submitError.set('');

        if (!this.selectedClinic()) {
            this.validationError.set('Выберите клинику');
            return;
        }
        if (this.hasDoctors() && !this.selectedDoctor()) {
            this.validationError.set('Выберите врача');
            return;
        }
        if (!this.selectedDate()) {
            this.validationError.set('Выберите дату');
            return;
        }
        if (!this.selectedTime()) {
            this.validationError.set('Выберите время');
            return;
        }
        if (this.bookingForm.invalid || !this.isPhoneValid()) {
            this.bookingForm.markAllAsTouched();
            this.validationError.set('Проверьте контактные данные');
            return;
        }

        this.isSubmitting.set(true);

        const value = this.bookingForm.value;
        const bookingData: BookingRequest = {
            clinic_id: this.selectedClinic(),
            date: this.selectedDate(),
            time: this.selectedTime(),
            name: value.name?.trim(),
            phone: value.phone,
            notes: value.notes?.trim() || undefined,
            ...(this.selectedDoctor() ? {doctor_id: this.selectedDoctor()} : {}),
            ...(value.email?.trim() ? {email: value.email.trim()} : {})
        };

        try {
            await firstValueFrom(this.bookingService.createBooking(bookingData, 'ru'));
            this.isSubmitted.set(true);
        } catch (error: any) {
            console.error('Booking submission error:', error);
            this.submitError.set(error.error?.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.');
        } finally {
            this.isSubmitting.set(false);
        }
    }

    onBack() {
        this.router.navigate(['/']);
    }
}
