import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { Booking } from './booking/booking';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'booking', component: Booking },
  { path: '**', redirectTo: '' }
];
