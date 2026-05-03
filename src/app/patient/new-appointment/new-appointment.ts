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
  Pencil,
  Sparkles,
  Loader2,
  CheckCircle2,
  CalendarPlus,
  ListChecks
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
  readonly Sparkles = Sparkles;
  readonly Loader2 = Loader2;
  readonly CheckCircle2 = CheckCircle2;
  readonly CalendarPlus = CalendarPlus;
  readonly ListChecks = ListChecks;

  clinics = signal<Clinic[]>([]);
  doctors = signal<Doctor[]>([]);
  availableTimes = signal<string[]>([]);

  selectedClinic = signal('');
  selectedDoctor = signal('');
  selectedDate = signal('');
  selectedTime = signal('');
  notes = signal('');
  showNotes = signal(false);
  isGeneratingNote = signal(false);

  editingStep = signal<EditingStep>(null);

  currentMonth = signal(new Date());
  calendarDays = computed(() => this.generateCalendarDays());

  isLoading = signal(false);
  showSuccessModal = signal(false);

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

  hasNoteDraft = computed(() => this.notes().trim().length > 0);

  async generateNoteWithAI(): Promise<void> {
    if (this.isGeneratingNote()) return;
    this.isGeneratingNote.set(true);

    const specialization = this.selectedDoctorData()?.specialization?.toLowerCase() ?? '';
    const draft = this.notes().trim();

    await new Promise(resolve => setTimeout(resolve, 1200));

    const result = draft
      ? this.expandDraftWithAI(draft, specialization)
      : this.pickFreshTemplate(specialization);

    this.notes.set(result);
    this.isGeneratingNote.set(false);
  }

  private pickFreshTemplate(specialization: string): string {
    const templates = this.getNoteTemplates(specialization);
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private expandDraftWithAI(draft: string, specialization: string): string {
    const lower = draft.toLowerCase();
    const startsFormally = /^(беспокоит|жалоб|прошу|нужн|хочу|обращаюсь|плановый)/i.test(draft);
    const endsWithPunctuation = /[.!?]$/.test(draft);

    const symptomFragment = startsFormally
      ? draft + (endsWithPunctuation ? '' : '.')
      : `Беспокоит: ${draft}${endsWithPunctuation ? '' : '.'}`;

    const closings: Record<string, string> = {
      'терапевт': ' Прошу провести осмотр, при необходимости назначить анализы и дать рекомендации по лечению.',
      'кардиолог': ' Прошу провести осмотр, измерить давление и при необходимости назначить ЭКГ.',
      'хирург': ' Прошу осмотреть и определить дальнейшую тактику лечения.',
      'невролог': ' Прошу провести неврологический осмотр и назначить необходимое обследование.',
      'офтальмолог': ' Прошу проверить остроту зрения и дать рекомендации.',
      'дерматолог': ' Прошу осмотреть кожные изменения и назначить лечение при необходимости.',
      'педиатр': ' Прошу осмотреть ребёнка и дать рекомендации.',
      'эндокринолог': ' Прошу проконсультировать и при необходимости назначить анализы на гормоны.',
      'уролог': ' Прошу провести осмотр и назначить необходимое обследование.',
      'гинеколог': ' Прошу провести осмотр и дать рекомендации.'
    };
    const closing = closings[specialization] ?? ' Прошу провести осмотр и дать рекомендации.';

    const durationHint = /(дн|недел|месяц|год)/i.test(lower)
      ? ''
      : ' Симптомы беспокоят на протяжении последнего времени.';

    return `${symptomFragment}${durationHint}${closing}`;
  }

  private getNoteTemplates(specialization: string): string[] {
    const generic = [
      'Профилактический осмотр и консультация по общему состоянию здоровья.',
      'Обращаюсь по поводу периодических недомоганий: общая слабость, утомляемость в течение последних двух недель.',
      'Плановый визит для уточнения диагноза и обсуждения дальнейших шагов лечения.',
      'Прошу проконсультировать по результатам последних анализов и назначить дальнейшее обследование.'
    ];
    const bySpec: Record<string, string[]> = {
      'терапевт': [
        'Беспокоят головные боли, повышенная утомляемость и эпизодически повышенная температура. Прошу осмотр и рекомендации.',
        'Нужна консультация по результатам общего анализа крови и направление к узкому специалисту при необходимости.'
      ],
      'кардиолог': [
        'Беспокоят периодические боли в области сердца и одышка при физической нагрузке. Прошу провести осмотр и при необходимости назначить ЭКГ.',
        'Контроль артериального давления: за последнюю неделю отмечаются скачки до 150/95. Прошу скорректировать лечение.'
      ],
      'хирург': [
        'Прошу осмотреть в связи с жалобами на боль и припухлость в области правого предплечья после ушиба.',
        'Консультация по результатам УЗИ и обсуждение возможных вариантов лечения.'
      ],
      'невролог': [
        'Беспокоят частые головные боли, головокружение и нарушения сна на протяжении последнего месяца.',
        'Жалобы на онемение и покалывание в правой руке, прошу осмотреть и назначить обследование.'
      ],
      'офтальмолог': [
        'Беспокоит ухудшение зрения вдаль и быстрая утомляемость глаз при работе за компьютером. Прошу проверить остроту зрения.',
        'Плановый осмотр и подбор корректирующих линз/очков.'
      ],
      'дерматолог': [
        'Появилось высыпание и зуд на коже предплечий, прошу осмотреть и определить причину.',
        'Хочу проконсультироваться по поводу родинки, которая немного изменилась за последние месяцы.'
      ],
      'педиатр': [
        'У ребёнка несколько дней держится субфебрильная температура и насморк. Прошу осмотр и рекомендации.',
        'Плановый осмотр ребёнка, консультация по вакцинации и общему развитию.'
      ],
      'эндокринолог': [
        'Беспокоит резкое изменение веса, прошу проконсультировать и назначить анализы на гормоны.',
        'Контроль уровня сахара в крови и обсуждение коррекции терапии.'
      ],
      'уролог': [
        'Прошу проконсультировать по результатам УЗИ почек и общим жалобам на дискомфорт в поясничной области.',
        'Профилактический осмотр и сдача необходимых анализов.'
      ],
      'гинеколог': [
        'Плановый профилактический осмотр и консультация.',
        'Прошу проконсультировать по результатам анализов и назначить дальнейшее обследование.'
      ]
    };
    return [...(bySpec[specialization] ?? []), ...generic];
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
      this.isLoading.set(false);
      this.showSuccessModal.set(true);
    }, 1000);
  }

  goToAppointments(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/patient/appointments']);
  }

  createAnother(): void {
    this.showSuccessModal.set(false);
    this.selectedDoctor.set('');
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.notes.set('');
    this.showNotes.set(false);
    this.editingStep.set('doctor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    this.router.navigate(['/patient/appointments']);
  }
}
