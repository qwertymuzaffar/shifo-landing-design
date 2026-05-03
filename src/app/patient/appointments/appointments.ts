import { Component, OnInit, signal, computed, inject, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  CalendarX,
  CalendarPlus,
  UserRound,
  Calendar,
  Clock,
  Building2,
  XCircle,
  Search,
  X,
  SlidersHorizontal,
  AlertTriangle,
  Check,
  CheckCircle2
} from 'lucide-angular';
import { AppointmentsService, Appointment, AppointmentStatus } from '../../core/services/appointments.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.scss']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  readonly Plus = Plus;
  readonly CalendarX = CalendarX;
  readonly CalendarPlus = CalendarPlus;
  readonly UserRound = UserRound;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Building2 = Building2;
  readonly XCircle = XCircle;
  readonly Search = Search;
  readonly X = X;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly AlertTriangle = AlertTriangle;
  readonly Check = Check;
  readonly CheckCircle2 = CheckCircle2;

  readonly cancelReasons: string[] = [
    'Изменились планы',
    'Записался к другому врачу',
    'Плохо себя чувствую',
    'Не смогу прийти вовремя',
    'Другое'
  ];

  private appointmentsService = inject(AppointmentsService);
  private route = inject(ActivatedRoute);
  private host: ElementRef<HTMLElement> = inject(ElementRef);

  appointments = this.appointmentsService.appointments;
  isLoading = signal(false);

  selectedTab = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');
  highlightedId = signal<string | null>(null);

  searchQuery = signal('');
  selectedClinic = signal('');

  private readonly PAGE_SIZE = 6;
  visibleCount = signal(this.PAGE_SIZE);

  // Cancellation modal
  cancellingAppointment = signal<Appointment | null>(null);
  selectedReason = signal<string>('');
  customReason = signal<string>('');
  cancelError = signal<string>('');
  cancelSubmitting = signal(false);
  cancelDone = signal(false);

  clinics = computed(() => {
    const set = new Set<string>();
    this.appointments().forEach(a => set.add(a.clinic));
    return Array.from(set).sort();
  });

  hasActiveFilters = computed(() => !!this.searchQuery().trim() || !!this.selectedClinic());

  upcomingCount = computed(() =>
    this.appointments().filter(a => a.status === 'pending' || a.status === 'confirmed').length
  );
  pastCount = computed(() =>
    this.appointments().filter(a => a.status === 'completed').length
  );
  cancelledCount = computed(() =>
    this.appointments().filter(a => a.status === 'cancelled').length
  );

  filteredAppointments = computed(() => {
    const tab = this.selectedTab();
    const query = this.searchQuery().toLowerCase().trim();
    const clinic = this.selectedClinic();
    const list = this.appointments().filter(a => {
      if (tab === 'upcoming' && !(a.status === 'pending' || a.status === 'confirmed')) return false;
      if (tab === 'past' && a.status !== 'completed') return false;
      if (tab === 'cancelled' && a.status !== 'cancelled') return false;
      if (clinic && a.clinic !== clinic) return false;
      if (query) {
        const hay = `${a.doctor} ${a.specialization}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    const dir = tab === 'upcoming' ? 1 : -1;
    return [...list].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return dir * cmp;
      return dir * a.time.localeCompare(b.time);
    });
  });

  displayedAppointments = computed(() =>
    this.filteredAppointments().slice(0, this.visibleCount())
  );

  hasMore = computed(() =>
    this.visibleCount() < this.filteredAppointments().length
  );

  remainingCount = computed(() =>
    this.filteredAppointments().length - this.visibleCount()
  );

  setTab(tab: 'upcoming' | 'past' | 'cancelled'): void {
    this.selectedTab.set(tab);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  setSearch(value: string): void {
    this.searchQuery.set(value);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  setClinic(value: string): void {
    this.selectedClinic.set(value);
    this.visibleCount.set(this.PAGE_SIZE);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedClinic.set('');
    this.visibleCount.set(this.PAGE_SIZE);
  }

  loadMore(): void {
    this.visibleCount.update(n => n + this.PAGE_SIZE);
  }

  ngOnInit(): void {
    const tabParam = this.route.snapshot.queryParamMap.get('tab');
    if (tabParam === 'upcoming' || tabParam === 'past' || tabParam === 'cancelled') {
      this.selectedTab.set(tabParam);
    }

    const highlightId = this.route.snapshot.queryParamMap.get('highlight');
    if (highlightId) {
      const target = this.appointmentsService.getById(highlightId);
      if (target) {
        this.selectedTab.set(this.tabFor(target.status));
        this.highlightedId.set(highlightId);
        const index = this.filteredAppointments().findIndex(a => a.id === highlightId);
        if (index >= this.visibleCount()) {
          const needed = Math.ceil((index + 1) / this.PAGE_SIZE) * this.PAGE_SIZE;
          this.visibleCount.set(needed);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const id = this.highlightedId();
    if (!id) return;
    setTimeout(() => {
      const el = this.host.nativeElement.querySelector<HTMLElement>(`[data-appointment-id="${id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => this.highlightedId.set(null), 2400);
    }, 50);
  }

  private tabFor(status: AppointmentStatus): 'upcoming' | 'past' | 'cancelled' {
    if (status === 'pending' || status === 'confirmed') return 'upcoming';
    if (status === 'completed') return 'past';
    return 'cancelled';
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  cancelAppointment(id: string): void {
    const appt = this.appointmentsService.getById(id);
    if (!appt) return;
    this.cancellingAppointment.set(appt);
    this.selectedReason.set('');
    this.customReason.set('');
    this.cancelError.set('');
    this.cancelDone.set(false);
  }

  closeCancelModal(): void {
    if (this.cancelSubmitting()) return;
    this.cancellingAppointment.set(null);
  }

  selectReason(reason: string): void {
    this.selectedReason.set(reason);
    this.cancelError.set('');
    if (reason !== 'Другое') {
      this.customReason.set('');
    }
  }

  confirmCancellation(): void {
    const appt = this.cancellingAppointment();
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
      setTimeout(() => {
        this.cancellingAppointment.set(null);
      }, 1400);
    }, 600);
  }
}
