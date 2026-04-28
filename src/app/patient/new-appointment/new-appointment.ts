import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  MapPin,
  Stethoscope,
  Calendar,
  Clock,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil
} from 'lucide-angular';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
}

type EditingStep = 'clinic' | 'doctor' | null;

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './new-appointment.html',
  styleUrls: ['./new-appointment.scss']
})
export class NewAppointmentComponent implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly Stethoscope = Stethoscope;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly FileText = FileText;
  readonly Check = Check;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Pencil = Pencil;

  clinics = signal<Clinic[]>([]);
  doctors = signal<Doctor[]>([]);
  availableTimes = signal<string[]>([]);

  selectedClinic = signal('');
  selectedDoctor = signal('');
  selectedDate = signal('');
  selectedTime = signal('');
  notes = signal('');
  showNotes = signal(false);

  editingStep = signal<EditingStep>(null);

  currentMonth = signal(new Date());
  calendarDays = computed(() => this.generateCalendarDays());

  isLoading = signal(false);

  selectedClinicData = computed(() =>
    this.clinics().find(c => c.id === this.selectedClinic())
  );

  selectedDoctorData = computed(() =>
    this.doctors().find(d => d.id === this.selectedDoctor())
  );

  isClinicExpanded = computed(() =>
    this.editingStep() === 'clinic' || !this.selectedClinic()
  );

  isDoctorExpanded = computed(() => {
    if (!this.selectedClinic()) return false;
    return this.editingStep() === 'doctor' || !this.selectedDoctor();
  });

  isDateTimeVisible = computed(() => !!this.selectedDoctor());

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics(): void {
    this.clinics.set([
      { id: '1', name: 'Клиника "Здоровье"', address: 'г. Худжанд, пр. И. Сомони, 203б' },
      { id: '2', name: 'Медицинский Центр "Shifo"', address: 'г. Худжанд, ул. Ленина, 15' },
      { id: '3', name: 'Городская Больница №1', address: 'г. Худжанд, ул. Гагарина, 42' },
      { id: '4', name: 'Центр Офтальмологии', address: 'г. Худжанд, ул. Рудаки, 88' },
      { id: '5', name: 'Стоматология "Дентал+"', address: 'г. Худжанд, пр. Камоли Худжанди, 10' }
    ]);
  }

  selectClinic(id: string): void {
    if (this.selectedClinic() !== id) {
      this.selectedClinic.set(id);
      this.selectedDoctor.set('');
      this.selectedDate.set('');
      this.selectedTime.set('');
      this.loadDoctors();
    }
    this.editingStep.set(null);
  }

  loadDoctors(): void {
    this.doctors.set([
      { id: '1', name: 'Алишер Каримов', specialization: 'Терапевт' },
      { id: '2', name: 'Дилноза Рашидова', specialization: 'Кардиолог' },
      { id: '3', name: 'Шерзод Махмудов', specialization: 'Хирург' },
      { id: '4', name: 'Нилуфар Азимова', specialization: 'Невролог' },
      { id: '5', name: 'Фарход Юсупов', specialization: 'Офтальмолог' },
      { id: '6', name: 'Малика Сатторова', specialization: 'Дерматолог' },
      { id: '7', name: 'Джамшед Ахмедов', specialization: 'Педиатр' },
      { id: '8', name: 'Зарина Холова', specialization: 'Эндокринолог' },
      { id: '9', name: 'Рустам Собиров', specialization: 'Уролог' },
      { id: '10', name: 'Гульнора Исмоилова', specialization: 'Гинеколог' }
    ]);
  }

  selectDoctor(id: string): void {
    if (this.selectedDoctor() !== id) {
      this.selectedDoctor.set(id);
      this.selectedDate.set('');
      this.selectedTime.set('');
    }
    this.editingStep.set(null);
  }

  editClinic(): void {
    this.editingStep.set('clinic');
  }

  editDoctor(): void {
    this.editingStep.set('doctor');
  }

  onDateChange(date: string): void {
    this.selectedDate.set(date);
    this.selectedTime.set('');
    if (date) {
      this.loadAvailableTimes();
    } else {
      this.availableTimes.set([]);
    }
  }

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

  selectDate(day: {date: Date | null, isCurrentMonth: boolean, isPast: boolean}): void {
    if (!day.date || day.isPast || !this.selectedDoctor()) return;

    const dateStr = this.formatLocalDate(day.date);
    this.onDateChange(dateStr);
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

  getMonthYearLabel(): string {
    const months = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    return `${months[this.currentMonth().getMonth()]} ${this.currentMonth().getFullYear()}`;
  }

  formatSelectedDate(): string {
    if (!this.selectedDate()) return '';
    const date = new Date(this.selectedDate());
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'short'
    });
  }

  loadAvailableTimes(): void {
    this.availableTimes.set([
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ]);
  }

  toggleNotes(): void {
    this.showNotes.update(v => !v);
  }

  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get isFormValid(): boolean {
    return !!(this.selectedClinic() && this.selectedDoctor() &&
              this.selectedDate() && this.selectedTime());
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid) return;

    this.isLoading.set(true);

    setTimeout(() => {
      alert('Запись успешно создана!');
      this.router.navigate(['/patient/appointments']);
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/patient/appointments']);
  }
}
