import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Plus,
  CalendarX,
  CalendarPlus,
  UserRound,
  Calendar,
  Clock,
  Building2,
  XCircle
} from 'lucide-angular';

interface Appointment {
  id: string;
  doctor: string;
  specialization: string;
  clinic: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.scss']
})
export class AppointmentsComponent implements OnInit {
  readonly Plus = Plus;
  readonly CalendarX = CalendarX;
  readonly CalendarPlus = CalendarPlus;
  readonly UserRound = UserRound;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Building2 = Building2;
  readonly XCircle = XCircle;

  appointments = signal<Appointment[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointments.set([
        {
          id: '1',
          doctor: 'Алишер Каримов',
          specialization: 'Терапевт',
          clinic: 'Клиника "Здоровье"',
          date: '2026-01-15',
          time: '10:00',
          status: 'confirmed'
        },
        {
          id: '2',
          doctor: 'Дилноза Рашидова',
          specialization: 'Кардиолог',
          clinic: 'Медицинский Центр "Shifo"',
          date: '2026-01-20',
          time: '14:30',
          status: 'pending'
        },
        {
          id: '3',
          doctor: 'Шерзод Махмудов',
          specialization: 'Хирург',
          clinic: 'Городская Больница №1',
          date: '2026-01-12',
          time: '09:00',
          status: 'completed'
        },
        {
          id: '4',
          doctor: 'Нилуфар Азимова',
          specialization: 'Невролог',
          clinic: 'Клиника "Здоровье"',
          date: '2026-02-01',
          time: '15:00',
          status: 'confirmed'
        },
        {
          id: '5',
          doctor: 'Фарход Юсупов',
          specialization: 'Офтальмолог',
          clinic: 'Центр Офтальмологии',
          date: '2026-01-08',
          time: '11:30',
          status: 'completed'
        },
        {
          id: '6',
          doctor: 'Малика Сатторова',
          specialization: 'Дерматолог',
          clinic: 'Медицинский Центр "Shifo"',
          date: '2026-01-05',
          time: '16:00',
          status: 'cancelled'
        }
      ]);
    this.isLoading.set(false);
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
      this.appointments.update(apps =>
        apps.map(app => app.id === id ? { ...app, status: 'cancelled' as const } : app)
      );
    }
  }
}
