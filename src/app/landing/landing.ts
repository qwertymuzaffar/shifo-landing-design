import {Component, effect, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    Activity,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Heart,
    LucideAngularModule,
    Mail,
    MapPin,
    Phone,
    Send,
    Shield,
    Stethoscope,
    Users,
    Zap
} from 'lucide-angular';
import {ContactService} from '../core/services/contact.service';
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
export class Landing {
    readonly Heart = Heart;
    readonly Zap = Zap;
    readonly Activity = Activity;
    readonly CheckCircle2 = CheckCircle2;
    readonly Shield = Shield;
    readonly Send = Send;
    readonly Mail = Mail;
    readonly Phone = Phone;
    readonly MapPin = MapPin;

    language = signal<'ru' | 'en'>('ru');
    contactForm: FormGroup;
    isSubmitting = signal(false);
    showSuccessMessage = signal(false);
    errorMessage = signal('');

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
        private contactService: ContactService
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

    setLanguage(lang: 'ru' | 'en') {
        this.language.set(lang);
    }

    onBookAppointment() {
        this.router.navigate(['/booking']);
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
