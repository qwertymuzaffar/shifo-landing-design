import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './patient.html',
  styleUrls: ['./patient.scss']
})
export class PatientComponent {
  private authService = inject(AuthService);

  isSidebarOpen = signal(true);
  currentPatient = this.authService.currentPatient;

  constructor() {}

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  logout(): void {
    if (confirm('Вы уверены, что хотите выйти?')) {
      this.authService.logout();
    }
  }

  get patientName(): string {
    const patient = this.currentPatient();
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Пациент';
  }
}
