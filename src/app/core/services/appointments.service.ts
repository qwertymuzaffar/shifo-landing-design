import { Injectable, signal } from '@angular/core';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  doctor: string;
  specialization: string;
  clinic: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  cancellationReason?: string;
}

const HEALTH = 'Клиника "Здоровье"';
const SHIFO = 'Медицинский Центр "Shifo"';
const GB1 = 'Городская Больница №1';
const OPHTHALMOLOGY = 'Центр Офтальмологии';
const DENTAL = 'Стоматология "Дентал+"';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private _appointments = signal<Appointment[]>([
    // === UPCOMING (12) ===
    { id: 'apt-up-001', doctor: 'Алишер Каримов',    specialization: 'Терапевт',         clinic: HEALTH,        date: '2026-05-02', time: '10:00', status: 'confirmed' },
    { id: 'apt-up-002', doctor: 'Дилноза Рашидова',  specialization: 'Кардиолог',        clinic: SHIFO,         date: '2026-05-08', time: '14:30', status: 'pending'   },
    { id: 'apt-up-003', doctor: 'Нилуфар Азимова',   specialization: 'Невролог',         clinic: HEALTH,        date: '2026-05-14', time: '11:00', status: 'confirmed' },
    { id: 'apt-up-004', doctor: 'Фарход Юсупов',     specialization: 'Офтальмолог',      clinic: OPHTHALMOLOGY, date: '2026-05-21', time: '09:30', status: 'confirmed' },
    { id: 'apt-up-005', doctor: 'Зарина Холова',     specialization: 'Эндокринолог',     clinic: SHIFO,         date: '2026-05-28', time: '15:00', status: 'pending'   },
    { id: 'apt-up-006', doctor: 'Алишер Каримов',    specialization: 'Терапевт',         clinic: HEALTH,        date: '2026-06-04', time: '10:30', status: 'confirmed' },
    { id: 'apt-up-007', doctor: 'Гульнора Исмоилова', specialization: 'Гинеколог',       clinic: SHIFO,         date: '2026-06-11', time: '14:00', status: 'confirmed' },
    { id: 'apt-up-008', doctor: 'Малика Сатторова',  specialization: 'Дерматолог',       clinic: SHIFO,         date: '2026-06-18', time: '16:00', status: 'pending'   },
    { id: 'apt-up-009', doctor: 'Бахтиёр Назаров',   specialization: 'ЛОР',              clinic: GB1,           date: '2026-06-25', time: '11:30', status: 'confirmed' },
    { id: 'apt-up-010', doctor: 'Азиза Турсунова',   specialization: 'Стоматолог',       clinic: DENTAL,        date: '2026-07-02', time: '13:00', status: 'confirmed' },
    { id: 'apt-up-011', doctor: 'Парвиз Ёдгоров',    specialization: 'Травматолог',      clinic: GB1,           date: '2026-07-09', time: '09:00', status: 'pending'   },
    { id: 'apt-up-012', doctor: 'Сухроб Раджабов',   specialization: 'Гастроэнтеролог',  clinic: SHIFO,         date: '2026-07-16', time: '15:30', status: 'confirmed' },

    // === CANCELLED (5) ===
    { id: 'apt-canc-001', doctor: 'Малика Сатторова', specialization: 'Дерматолог', clinic: SHIFO,  date: '2026-04-05', time: '16:00', status: 'cancelled' },
    { id: 'apt-canc-002', doctor: 'Дилноза Рашидова', specialization: 'Кардиолог',  clinic: SHIFO,  date: '2026-03-12', time: '10:00', status: 'cancelled' },
    { id: 'apt-canc-003', doctor: 'Алишер Каримов',   specialization: 'Терапевт',   clinic: HEALTH, date: '2026-02-20', time: '11:00', status: 'cancelled' },
    { id: 'apt-canc-004', doctor: 'Шерзод Махмудов',  specialization: 'Хирург',     clinic: GB1,    date: '2026-01-15', time: '14:00', status: 'cancelled' },
    { id: 'apt-canc-005', doctor: 'Нилуфар Азимова',  specialization: 'Невролог',   clinic: HEALTH, date: '2025-12-22', time: '15:30', status: 'cancelled' },

    // === PAST (34) — newest first ===
    { id: 'apt-p-001', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2026-04-22', time: '10:00', status: 'completed' },
    { id: 'apt-p-002', doctor: 'Дилноза Рашидова',   specialization: 'Кардиолог',       clinic: SHIFO,         date: '2026-04-15', time: '14:00', status: 'completed' },
    { id: 'apt-p-003', doctor: 'Фарход Юсупов',      specialization: 'Офтальмолог',     clinic: OPHTHALMOLOGY, date: '2026-04-08', time: '09:30', status: 'completed' },
    { id: 'apt-p-004', doctor: 'Шерзод Махмудов',    specialization: 'Хирург',          clinic: GB1,           date: '2026-03-25', time: '11:00', status: 'completed' },
    { id: 'apt-p-005', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2026-03-18', time: '10:30', status: 'completed' },
    { id: 'apt-p-006', doctor: 'Малика Сатторова',   specialization: 'Дерматолог',      clinic: SHIFO,         date: '2026-03-04', time: '16:00', status: 'completed' },
    { id: 'apt-p-007', doctor: 'Зарина Холова',      specialization: 'Эндокринолог',    clinic: SHIFO,         date: '2026-02-26', time: '15:00', status: 'completed' },
    { id: 'apt-p-008', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2026-02-12', time: '11:00', status: 'completed' },
    { id: 'apt-p-009', doctor: 'Бахтиёр Назаров',    specialization: 'ЛОР',             clinic: GB1,           date: '2026-02-05', time: '13:00', status: 'completed' },
    { id: 'apt-p-010', doctor: 'Гульнора Исмоилова', specialization: 'Гинеколог',       clinic: SHIFO,         date: '2026-01-28', time: '14:00', status: 'completed' },
    { id: 'apt-p-011', doctor: 'Джамшед Ахмедов',    specialization: 'Педиатр',         clinic: HEALTH,        date: '2026-01-21', time: '10:00', status: 'completed' },
    { id: 'apt-p-012', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2026-01-14', time: '11:30', status: 'completed' },
    { id: 'apt-p-013', doctor: 'Нилуфар Азимова',    specialization: 'Невролог',        clinic: HEALTH,        date: '2025-12-30', time: '15:00', status: 'completed' },
    { id: 'apt-p-014', doctor: 'Парвиз Ёдгоров',     specialization: 'Травматолог',     clinic: GB1,           date: '2025-12-15', time: '09:00', status: 'completed' },
    { id: 'apt-p-015', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-12-01', time: '10:00', status: 'completed' },
    { id: 'apt-p-016', doctor: 'Дилноза Рашидова',   specialization: 'Кардиолог',       clinic: SHIFO,         date: '2025-11-20', time: '14:30', status: 'completed' },
    { id: 'apt-p-017', doctor: 'Шерзод Махмудов',    specialization: 'Хирург',          clinic: GB1,           date: '2025-11-10', time: '11:00', status: 'completed' },
    { id: 'apt-p-018', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-10-28', time: '10:00', status: 'completed' },
    { id: 'apt-p-019', doctor: 'Сухроб Раджабов',    specialization: 'Гастроэнтеролог', clinic: SHIFO,         date: '2025-10-15', time: '13:30', status: 'completed' },
    { id: 'apt-p-020', doctor: 'Шерзод Махмудов',    specialization: 'Хирург',          clinic: GB1,           date: '2025-10-05', time: '09:30', status: 'completed' },
    { id: 'apt-p-021', doctor: 'Севара Давлатова',   specialization: 'Психотерапевт',   clinic: SHIFO,         date: '2025-09-22', time: '16:00', status: 'completed' },
    { id: 'apt-p-022', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-09-15', time: '10:30', status: 'completed' },
    { id: 'apt-p-023', doctor: 'Рустам Собиров',     specialization: 'Уролог',          clinic: SHIFO,         date: '2025-09-08', time: '11:30', status: 'completed' },
    { id: 'apt-p-024', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-08-25', time: '10:00', status: 'completed' },
    { id: 'apt-p-025', doctor: 'Дилноза Рашидова',   specialization: 'Кардиолог',       clinic: SHIFO,         date: '2025-08-18', time: '14:00', status: 'completed' },
    { id: 'apt-p-026', doctor: 'Зарина Холова',      specialization: 'Эндокринолог',    clinic: SHIFO,         date: '2025-08-10', time: '15:30', status: 'completed' },
    { id: 'apt-p-027', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-07-22', time: '10:00', status: 'completed' },
    { id: 'apt-p-028', doctor: 'Фарход Юсупов',      specialization: 'Офтальмолог',     clinic: OPHTHALMOLOGY, date: '2025-06-30', time: '09:30', status: 'completed' },
    { id: 'apt-p-029', doctor: 'Малика Сатторова',   specialization: 'Дерматолог',      clinic: SHIFO,         date: '2025-06-12', time: '16:00', status: 'completed' },
    { id: 'apt-p-030', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-05-25', time: '10:30', status: 'completed' },
    { id: 'apt-p-031', doctor: 'Гульнора Исмоилова', specialization: 'Гинеколог',       clinic: SHIFO,         date: '2025-04-18', time: '14:00', status: 'completed' },
    { id: 'apt-p-032', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-03-10', time: '11:00', status: 'completed' },
    { id: 'apt-p-033', doctor: 'Бахтиёр Назаров',    specialization: 'ЛОР',             clinic: GB1,           date: '2025-02-12', time: '13:00', status: 'completed' },
    { id: 'apt-p-034', doctor: 'Алишер Каримов',     specialization: 'Терапевт',        clinic: HEALTH,        date: '2025-01-15', time: '10:00', status: 'completed' }
  ]);

  appointments = this._appointments.asReadonly();

  getById(id: string): Appointment | undefined {
    return this._appointments().find(a => a.id === id);
  }

  cancel(id: string, reason?: string): void {
    this._appointments.update(apps =>
      apps.map(a =>
        a.id === id
          ? { ...a, status: 'cancelled', cancellationReason: reason }
          : a
      )
    );
  }
}
