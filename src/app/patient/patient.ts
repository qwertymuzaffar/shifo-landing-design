import { Component, OnInit, PLATFORM_ID, signal, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import {
  LucideAngularModule,
  Menu,
  Calendar,
  FileText,
  User,
  LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './patient.html',
  styleUrls: ['./patient.scss']
})
export class PatientComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  readonly Menu = Menu;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly User = User;
  readonly LogOut = LogOut;

  isSidebarOpen = signal(true);
  currentPatient = this.authService.currentPatient;

  constructor() {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Default to closed on small screens
      if (window.innerWidth <= 768) {
        this.isSidebarOpen.set(false);
      }
      // Auto-close on navigation while on mobile
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          if (window.innerWidth <= 768) {
            this.isSidebarOpen.set(false);
          }
        });
    }
  }

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
