import {Component, effect, signal, computed, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    Activity,
    ArrowRight,
    BarChart3,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Heart,
    LucideAngularModule,
    Mail,
    MapPin,
    Phone,
    Search,
    Send,
    Shield,
    Stethoscope,
    Users,
    Zap
} from 'lucide-angular';
import {ContactService} from '../core/services/contact.service';
import {ClinicService} from '../core/services/clinic.service';
import {BookingService} from '../core/services/booking.service';
import {Clinic} from '../core/models/clinic.model';
import {BookingRequest} from '../core/models/booking.model';
import {firstValueFrom} from 'rxjs';
import {Translations} from "../core/models/translation.model";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        ReactiveFormsModule
    ],
    templateUrl: './landing.html',
    styleUrl: './landing.scss',
})
export class Landing implements OnInit {
    readonly Heart = Heart;
    readonly Zap = Zap;
    readonly Activity = Activity;
    readonly CheckCircle2 = CheckCircle2;
    readonly Shield = Shield;
    readonly Send = Send;
    readonly Mail = Mail;
    readonly Phone = Phone;
    readonly MapPin = MapPin;
    readonly Calendar = Calendar;
    readonly Clock = Clock;
    readonly Building2 = Building2;
    readonly Search = Search;
    readonly ChevronLeft = ChevronLeft;
    readonly ChevronRight = ChevronRight;
    readonly ArrowRight = ArrowRight;

    language = signal<'ru' | 'en'>('ru');
    contactForm: FormGroup;
    isSubmitting = signal(false);
    showSuccessMessage = signal(false);
    errorMessage = signal('');

    // Quick booking state
    clinics = signal<Clinic[]>([]);
    isLoadingClinics = signal(false);
    clinicError = signal('');
    qbSelectedClinic = signal('');
    qbSearchQuery = signal('');
    qbShowClinicDropdown = signal(false);
    qbSelectedDate = signal('');
    qbSelectedTime = signal('');
    qbPhone = signal('');
    qbName = signal('');
    qbCurrentWeekOffset = signal(0);
    qbIsSubmitting = signal(false);
    qbIsSubmitted = signal(false);
    qbSubmitError = signal('');

    readonly timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    qbFilteredClinics = computed(() => {
        const query = this.qbSearchQuery().toLowerCase();
        return this.clinics().filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.address.toLowerCase().includes(query)
        );
    });

    qbSelectedClinicData = computed(() =>
        this.clinics().find(c => c.id === this.qbSelectedClinic())
    );

    qbWeekDays = computed(() => this.getQuickBookWeek());

    readonly translations: Record<'ru' | 'en', Translations> = {
        ru: {
            loginButton: 'Войти в систему',
            bookAppointment: 'Записаться на прием',
            modernSystem: 'Современная система управления',
            heroTitle: 'Цифровое будущее вашей клиники',
            heroDescription: 'Полнофункциональная система для управления медицинской клиникой. Управляйте пациентами, врачами, записями и финансами в одном месте.',
            getStarted: 'Начать работу',
            learnMore: 'Написать нам',
            todayAppointments: 'Приема сегодня',
            patients: 'Пациентов',
            availability: 'Доступность системы',
            dataSecurity: 'Безопасность данных',
            speed: 'Скорость работы',
            unlimited: 'Пациентов в базе',
            allTools: 'Все инструменты в одной системе',
            allToolsDesc: 'Комплексное решение для эффективного управления медицинской клиникой любого размера',
            whyChoose: 'Почему выбирают Shifo?',
            whyChooseDesc: 'Современная система, созданная с учетом потребностей медицинских учреждений',
            securityTitle: 'Безопасность данных',
            securityDesc: 'Все данные пациентов надежно защищены и хранятся в соответствии с международными стандартами безопасности медицинской информации.',
            encryption: 'Шифрование данных',
            backups: 'Регулярные резервные копии',
            accessControl: 'Контроль доступа',
            contactUs: 'Свяжитесь с нами',
            contactDesc: 'Остались вопросы? Мы всегда готовы помочь',
            sendMessage: 'Отправить сообщение',
            name: 'Имя',
            yourName: 'Ваше имя',
            phone: 'Телефон',
            message: 'Сообщение',
            messagePlaceholder: 'Расскажите о вашей клинике и потребностях...',
            send: 'Отправить сообщение',
            contactInfo: 'Контактная информация',
            address: 'Адрес',
            addressText: 'г. Худжанд, Согдийская область,\nпр. И. Сомони, 203б',
            workingHours: 'Пн-Пт: 9:00 - 18:00',
            footerDesc: 'Современная система управления медицинской клиникой',
            rights: 'Все права защищены',
            quickBookTitle: 'Быстрая запись на прием',
            quickBookDesc: 'Выберите клинику, дату и время — запишитесь за несколько секунд',
            selectClinic: 'Выберите клинику',
            searchClinics: 'Поиск клиники...',
            selectDate: 'Выберите дату',
            selectTime: 'Выберите время',
            yourPhone: 'Ваш телефон',
            bookNow: 'Записаться',
            booking: 'Запись...',
            noClinicsFound: 'Клиники не найдены',
            loadingClinics: 'Загрузка...',
            clinicLoadError: 'Не удалось загрузить клиники',
            retry: 'Повторить',
            today: 'Сегодня',
            quickBookSuccess: 'Вы записаны!',
            quickBookSuccessDesc: 'Мы свяжемся с вами для подтверждения',
            quickBookAnother: 'Новая запись',
            phoneRequired: 'Введите номер телефона',
            fillAllFields: 'Заполните все поля',
            quickBookError: 'Ошибка. Попробуйте еще раз.',
            features: [
                {
                    title: 'Управление пациентами',
                    desc: 'Полная база данных пациентов с историей болезней, контактами и важной медицинской информацией'
                },
                {
                    title: 'База врачей',
                    desc: 'Управление персоналом клиники: специализации, расписание, тарифы и опыт работы'
                },
                {
                    title: 'Запись на прием',
                    desc: 'Интеллектуальная система записи с автоматической проверкой конфликтов и доступности'
                },
                {title: 'Финансовый учет', desc: 'Полный контроль платежей, расходов и финансовой отчетности клиники'},
                {
                    title: 'Аналитика',
                    desc: 'Детальная статистика работы клиники: посещаемость, доходы, популярные услуги'
                },
                {
                    title: 'Расписание',
                    desc: 'Визуализация расписания врачей с возможностью планирования на месяцы вперед'
                }
            ],
            benefits: [
                'Автоматизация рутинных процессов',
                'Снижение ошибок при записи',
                'Повышение качества обслуживания',
                'Прозрачная финансовая отчетность',
                'Быстрый доступ к данным пациентов',
                'Оптимизация загрузки врачей'
            ]
        },
        en: {
            loginButton: 'Login to System',
            bookAppointment: 'Book Appointment',
            modernSystem: 'Modern Management System',
            heroTitle: 'Digital Future of Your Clinic',
            heroDescription: 'Full-featured system for managing medical clinics. Manage patients, doctors, appointments and finances in one place.',
            getStarted: 'Get Started',
            learnMore: 'Write to Us',
            todayAppointments: 'Appointments Today',
            patients: 'Patients',
            availability: 'System Availability',
            dataSecurity: 'Data Security',
            speed: 'Performance',
            unlimited: 'Patients in Database',
            allTools: 'All Tools in One System',
            allToolsDesc: 'Comprehensive solution for effective management of medical clinics of any size',
            whyChoose: 'Why Choose Shifo?',
            whyChooseDesc: 'Modern system designed with the needs of medical facilities in mind',
            securityTitle: 'Data Security',
            securityDesc: 'All patient data is securely protected and stored in accordance with international medical information security standards.',
            encryption: 'Data Encryption',
            backups: 'Regular Backups',
            accessControl: 'Access Control',
            contactUs: 'Contact Us',
            contactDesc: 'Have questions? We are always ready to help',
            sendMessage: 'Send Message',
            name: 'Name',
            yourName: 'Your Name',
            phone: 'Phone',
            message: 'Message',
            messagePlaceholder: 'Tell us about your clinic and needs...',
            send: 'Send Message',
            contactInfo: 'Contact Information',
            address: 'Address',
            addressText: 'Tashkent, Mirabad District,\nAmir Temur Street, 107',
            workingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
            footerDesc: 'Modern medical clinic management system',
            rights: 'All rights reserved',
            quickBookTitle: 'Quick Appointment Booking',
            quickBookDesc: 'Select a clinic, date and time — book in seconds',
            selectClinic: 'Select clinic',
            searchClinics: 'Search clinics...',
            selectDate: 'Select date',
            selectTime: 'Select time',
            yourPhone: 'Your phone',
            bookNow: 'Book Now',
            booking: 'Booking...',
            noClinicsFound: 'No clinics found',
            loadingClinics: 'Loading...',
            clinicLoadError: 'Failed to load clinics',
            retry: 'Retry',
            today: 'Today',
            quickBookSuccess: 'You are booked!',
            quickBookSuccessDesc: 'We will contact you to confirm',
            quickBookAnother: 'Book Another',
            phoneRequired: 'Phone number is required',
            fillAllFields: 'Please fill all fields',
            quickBookError: 'Error. Please try again.',
            features: [
                {
                    title: 'Patient Management',
                    desc: 'Complete patient database with medical history, contacts and important medical information'
                },
                {
                    title: 'Doctor Database',
                    desc: 'Clinic staff management: specializations, schedules, rates and work experience'
                },
                {
                    title: 'Appointment Booking',
                    desc: 'Intelligent booking system with automatic conflict checking and availability'
                },
                {
                    title: 'Financial Accounting',
                    desc: 'Complete control of payments, expenses and clinic financial reporting'
                },
                {title: 'Analytics', desc: 'Detailed clinic statistics: attendance, revenue, popular services'},
                {title: 'Schedule', desc: 'Doctor schedule visualization with planning capability months ahead'}
            ],
            benefits: [
                'Automation of routine processes',
                'Reduction of appointment errors',
                'Improved service quality',
                'Transparent financial reporting',
                'Quick access to patient data',
                'Optimization of doctor workload'
            ]
        }
    };

    get t(): Translations {
        return this.translations[this.language()];
    }

    readonly featureIcons = [Users, Stethoscope, Calendar, DollarSign, BarChart3, Clock];

    get stats() {
        const t = this.t;
        return [
            {value: '24/7', label: t.availability},
            {value: '100%', label: t.dataSecurity},
            {value: '<1 sec', label: t.speed},
            {value: '∞', label: t.unlimited}
        ];
    }

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private contactService: ContactService,
        private clinicService: ClinicService,
        private bookingService: BookingService
    ) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            message: ['', Validators.required]
        });

        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('landing-language');
            if (stored === 'ru' || stored === 'en') {
                this.language.set(stored);
            }
        }

        effect(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('landing-language', this.language());
            }
        });
    }

    ngOnInit() {
        this.fetchClinics();
    }

    setLanguage(lang: 'ru' | 'en') {
        this.language.set(lang);
    }

    onBookAppointment() {
        this.router.navigate(['/booking']);
    }

    onGetStarted() {
        this.router.navigate(['/login']);
    }

    // Quick booking methods
    async fetchClinics() {
        this.isLoadingClinics.set(true);
        this.clinicError.set('');
        try {
            const data = await firstValueFrom(this.clinicService.getClinics(this.language()));
            this.clinics.set(data);
        } catch {
            this.clinicError.set(this.t.clinicLoadError);
        } finally {
            this.isLoadingClinics.set(false);
        }
    }

    getQuickBookWeek(): Date[] {
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        monday.setDate(monday.getDate() + (this.qbCurrentWeekOffset() * 7));
        const week: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            week.push(date);
        }
        return week;
    }

    qbGoToPreviousWeek() {
        this.qbCurrentWeekOffset.update(v => v - 1);
    }

    qbGoToNextWeek() {
        this.qbCurrentWeekOffset.update(v => v + 1);
    }

    qbGoToCurrentWeek() {
        this.qbCurrentWeekOffset.set(0);
    }

    qbGetWeekRange(): string {
        const week = this.getQuickBookWeek();
        const locale = this.language() === 'ru' ? 'ru-RU' : 'en-US';
        const start = week[0];
        const end = week[6];
        return `${start.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`;
    }

    qbFormatDate(date: Date): string {
        return date.getDate().toString();
    }

    qbGetDayName(date: Date): string {
        const locale = this.language() === 'ru' ? 'ru-RU' : 'en-US';
        return date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2);
    }

    qbIsToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    qbIsPastDate(date: Date): boolean {
        return date < new Date(new Date().setHours(0, 0, 0, 0));
    }

    qbSelectClinic(clinicId: string) {
        this.qbSelectedClinic.set(clinicId);
        this.qbSearchQuery.set('');
        this.qbShowClinicDropdown.set(false);
    }

    qbSelectDate(date: Date) {
        if (!this.qbIsPastDate(date)) {
            this.qbSelectedDate.set(date.toISOString().split('T')[0]);
        }
    }

    qbSelectTime(time: string) {
        this.qbSelectedTime.set(time);
    }

    async qbSubmit() {
        if (!this.qbSelectedClinic() || !this.qbSelectedDate() || !this.qbSelectedTime() || !this.qbPhone() || !this.qbName()) {
            this.qbSubmitError.set(this.t.fillAllFields);
            return;
        }

        this.qbIsSubmitting.set(true);
        this.qbSubmitError.set('');

        const bookingData: BookingRequest = {
            clinic_id: this.qbSelectedClinic(),
            date: this.qbSelectedDate(),
            time: this.qbSelectedTime(),
            name: this.qbName(),
            phone: this.qbPhone(),
            email: '',
        };

        try {
            await firstValueFrom(this.bookingService.createBooking(bookingData, this.language()));
            this.qbIsSubmitted.set(true);
        } catch {
            this.qbSubmitError.set(this.t.quickBookError);
        } finally {
            this.qbIsSubmitting.set(false);
        }
    }

    qbReset() {
        this.qbSelectedClinic.set('');
        this.qbSelectedDate.set('');
        this.qbSelectedTime.set('');
        this.qbPhone.set('');
        this.qbName.set('');
        this.qbIsSubmitted.set(false);
        this.qbSubmitError.set('');
        this.qbCurrentWeekOffset.set(0);
    }

    async onSubmit(event: Event) {
        event.preventDefault();

        if (this.contactForm.invalid || this.isSubmitting()) {
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');
        this.showSuccessMessage.set(false);

        try {
            await firstValueFrom(this.contactService.sendContactForm(this.contactForm.value, this.language()));

            this.showSuccessMessage.set(true);
            this.contactForm.reset();

            setTimeout(() => {
                this.showSuccessMessage.set(false);
            }, 5000);
        } catch (error: any) {
            console.error('Error submitting form:', error);
            this.errorMessage.set(error.error?.message || 'Failed to send message. Please try again.');
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
