import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Patient, LoginRequest } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private currentPatientSignal = signal<Patient | null>(null);
  public currentPatient = this.currentPatientSignal.asReadonly();

  constructor() {
    this.loadPatientFromStorage();
  }

  async login(credentials: LoginRequest): Promise<boolean> {
    if (credentials.email === 'admin@clinic.com' && credentials.password === 'admin') {
      const patient: Patient = {
        id: '1',
        email: 'admin@clinic.com',
        phone: '+998901234567',
        first_name: 'Admin',
        last_name: 'Patient',
        date_of_birth: '1990-01-01',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.currentPatientSignal.set(patient);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentPatient', JSON.stringify(patient));
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentPatientSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentPatient');
    }

    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.currentPatient() !== null;
  }

  private loadPatientFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const patientData = localStorage.getItem('currentPatient');
    if (patientData) {
      try {
        const patient = JSON.parse(patientData);
        this.currentPatientSignal.set(patient);
      } catch (error) {
        localStorage.removeItem('currentPatient');
      }
    }
  }
}
