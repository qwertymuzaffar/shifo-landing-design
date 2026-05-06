import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  UserRound,
  XCircle,
  CalendarPlus,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Download,
  TestTube,
  ScanLine,
  ClipboardList,
  Stethoscope
} from 'lucide-angular';
import { AppointmentsService, Appointment } from '../../core/services/appointments.service';
import { DocumentsService, PatientDocument, DocumentCategory } from '../../core/services/documents.service';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './appointment-detail.html',
  styleUrls: ['./appointment-detail.scss']
})
export class AppointmentDetailComponent implements OnInit {
  readonly ArrowLeft = ArrowLeft;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Building2 = Building2;
  readonly UserRound = UserRound;
  readonly XCircle = XCircle;
  readonly CalendarPlus = CalendarPlus;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle2 = CheckCircle2;
  readonly X = X;
  readonly FileText = FileText;
  readonly Download = Download;
  readonly TestTube = TestTube;
  readonly ScanLine = ScanLine;
  readonly ClipboardList = ClipboardList;
  readonly Stethoscope = Stethoscope;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appointmentsService = inject(AppointmentsService);
  private documentsService = inject(DocumentsService);

  appointmentId = signal<string>('');

  appointment = computed<Appointment | null>(() => {
    const id = this.appointmentId();
    if (!id) return null;
    return this.appointmentsService.getById(id) ?? null;
  });

  relatedDocuments = computed<PatientDocument[]>(() => {
    const id = this.appointmentId();
    if (!id) return [];
    return [...this.documentsService.forAppointment(id)].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  });

  isUpcoming = computed(() => {
    const a = this.appointment();
    return !!a && (a.status === 'pending' || a.status === 'confirmed');
  });

  // Cancel modal state (mirrors appointments.ts)
  readonly cancelReasons: string[] = [
    'Изменились планы',
    'Записался к другому врачу',
    'Плохо себя чувствую',
    'Не смогу прийти вовремя',
    'Другое'
  ];
  showCancelModal = signal(false);
  selectedReason = signal<string>('');
  customReason = signal<string>('');
  cancelError = signal<string>('');
  cancelSubmitting = signal(false);
  cancelDone = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.appointmentId.set(id);
  }

  goBack(): void {
    this.router.navigate(['/patient/appointments']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  }

  formatShortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтверждено',
      completed: 'Завершено',
      cancelled: 'Отменено'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  doctorInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('');
  }

  iconFor(category: DocumentCategory) {
    if (category === 'tests') return this.TestTube;
    if (category === 'imaging') return this.ScanLine;
    return this.ClipboardList;
  }

  // ---- Cancel modal ----
  openCancelModal(): void {
    this.selectedReason.set('');
    this.customReason.set('');
    this.cancelError.set('');
    this.cancelDone.set(false);
    this.showCancelModal.set(true);
  }

  closeCancelModal(): void {
    if (this.cancelSubmitting()) return;
    this.showCancelModal.set(false);
  }

  selectReason(reason: string): void {
    this.selectedReason.set(reason);
    this.cancelError.set('');
    if (reason !== 'Другое') this.customReason.set('');
  }

  confirmCancellation(): void {
    const appt = this.appointment();
    if (!appt) return;
    const picked = this.selectedReason();
    if (!picked) {
      this.cancelError.set('Пожалуйста, выберите причину отмены');
      return;
    }
    let reason = picked;
    if (picked === 'Другое') {
      const custom = this.customReason().trim();
      if (custom.length < 3) {
        this.cancelError.set('Опишите причину (минимум 3 символа)');
        return;
      }
      reason = custom;
    }
    this.cancelError.set('');
    this.cancelSubmitting.set(true);
    setTimeout(() => {
      this.appointmentsService.cancel(appt.id, reason);
      this.cancelSubmitting.set(false);
      this.cancelDone.set(true);
      setTimeout(() => this.showCancelModal.set(false), 1400);
    }, 600);
  }

  // ---- Add to calendar (.ics) ----
  downloadIcs(): void {
    const a = this.appointment();
    if (!a) return;

    const start = new Date(`${a.date}T${a.time}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const escape = (s: string) => s.replace(/[\\,;]/g, ch => '\\' + ch).replace(/\n/g, '\\n');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shifo//Patient Appointment//RU',
      'BEGIN:VEVENT',
      `UID:${a.id}@shifo`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(`Приём у врача — ${a.doctor} (${a.specialization})`)}`,
      `LOCATION:${escape(a.clinic)}`,
      `DESCRIPTION:${escape(`Запись в ${a.clinic} к врачу ${a.doctor}`)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${a.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
