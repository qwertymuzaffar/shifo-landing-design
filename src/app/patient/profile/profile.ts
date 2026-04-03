import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import {
  LucideAngularModule,
  Camera,
  CalendarCheck,
  FileText,
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  X,
  Check
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  private authService = inject(AuthService);

  readonly Camera = Camera;
  readonly CalendarCheck = CalendarCheck;
  readonly FileText = FileText;
  readonly Pencil = Pencil;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Calendar = Calendar;
  readonly X = X;
  readonly Check = Check;

  currentPatient = this.authService.currentPatient;
  isEditing = signal(false);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  dateOfBirth = signal('');

  constructor() {
    const patient = this.currentPatient();
    if (patient) {
      this.firstName.set(patient.first_name);
      this.lastName.set(patient.last_name);
      this.email.set(patient.email);
      this.phone.set(patient.phone);
      this.dateOfBirth.set(patient.date_of_birth || '');
    }
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
  }

  saveProfile(): void {
    alert('Профиль успешно обновлен!');
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    const patient = this.currentPatient();
    if (patient) {
      this.firstName.set(patient.first_name);
      this.lastName.set(patient.last_name);
      this.email.set(patient.email);
      this.phone.set(patient.phone);
      this.dateOfBirth.set(patient.date_of_birth || '');
    }
    this.isEditing.set(false);
  }
}
