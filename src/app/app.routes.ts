import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Booking } from './booking/booking';
import { LoginComponent } from './login/login';
import { BrandbookComponent } from './brandbook/brandbook';
import { PatientComponent } from './patient/patient';
import { AppointmentsComponent } from './patient/appointments/appointments';
import { NewAppointmentComponent } from './patient/new-appointment/new-appointment';
import { AppointmentDetailComponent } from './patient/appointment-detail/appointment-detail';
import { DocumentsComponent } from './patient/documents/documents';
import { DocumentDetailComponent } from './patient/document-detail/document-detail';
import { ProfileComponent } from './patient/profile/profile';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'booking', component: Booking },
  { path: 'login', component: LoginComponent },
  { path: 'brandbook', component: BrandbookComponent },
  {
    path: 'patient',
    component: PatientComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'appointments/new', component: NewAppointmentComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'documents/:id', component: DocumentDetailComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
