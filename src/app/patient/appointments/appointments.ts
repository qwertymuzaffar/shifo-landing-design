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
  SlidersHorizontal
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
    if (confirm('Вы уверены, что хотите отменить запись?')) {
      this.appointmentsService.cancel(id);
    }
  }
}
