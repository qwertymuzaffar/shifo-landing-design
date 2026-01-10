import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

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
  appointments = signal<Appointment[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    setTimeout(() => {
      this.appointments.set([
        {
          id: '1',
          doctor: 'Алишер Каримов',
          specialization: 'Терапевт',
          clinic: 'Клиника №1',
          date: '2026-01-15',
          time: '10:00',
          status: 'confirmed'
        },
        {
          id: '2',
          doctor: 'Дилноза Рашидова',
          specialization: 'Кардиолог',
          clinic: 'Клиника №2',
          date: '2026-01-20',
          time: '14:30',
          status: 'pending'
        }
      ]);
      this.isLoading.set(false);
    }, 500);
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
