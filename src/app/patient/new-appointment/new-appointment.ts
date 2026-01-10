import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
}

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './new-appointment.html',
  styleUrls: ['./new-appointment.scss']
})
export class NewAppointmentComponent implements OnInit {
  clinics = signal<Clinic[]>([]);
  doctors = signal<Doctor[]>([]);
  availableTimes = signal<string[]>([]);

  selectedClinic = signal('');
  selectedDoctor = signal('');
  selectedDate = signal('');
  selectedTime = signal('');
  notes = signal('');

  isLoading = signal(false);

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

  onClinicChange(): void {
    this.selectedDoctor.set('');
    this.selectedDate.set('');
    this.selectedTime.set('');

    if (this.selectedClinic()) {
      this.loadDoctors();
    } else {
      this.doctors.set([]);
    }
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

  onDoctorChange(): void {
    this.selectedDate.set('');
    this.selectedTime.set('');
  }

  onDateChange(): void {
    this.selectedTime.set('');
    if (this.selectedDate()) {
      this.loadAvailableTimes();
    } else {
      this.availableTimes.set([]);
    }
  }

  loadAvailableTimes(): void {
    this.availableTimes.set([
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ]);
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
