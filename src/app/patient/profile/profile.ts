import { Component, signal, computed, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppointmentsService } from '../../core/services/appointments.service';
import {
  LucideAngularModule,
  Camera,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  FileText,
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  X,
  Check,
  HeartPulse,
  Activity,
  Droplet,
  Ruler,
  Weight,
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  Lock,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon
} from 'lucide-angular';

type EditableSection = 'personal' | 'medical' | 'emergency';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private appointmentsService = inject(AppointmentsService);
  private router = inject(Router);

  @ViewChild('photoInput') photoInput?: ElementRef<HTMLInputElement>;

  readonly Camera = Camera;
  readonly CalendarCheck = CalendarCheck;
  readonly CalendarClock = CalendarClock;
  readonly CalendarX = CalendarX;
  readonly FileText = FileText;
  readonly Pencil = Pencil;
  readonly User = User;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Calendar = Calendar;
  readonly X = X;
  readonly Check = Check;
  readonly HeartPulse = HeartPulse;
  readonly Activity = Activity;
  readonly Droplet = Droplet;
  readonly Ruler = Ruler;
  readonly Weight = Weight;
  readonly AlertTriangle = AlertTriangle;
  readonly ShieldAlert = ShieldAlert;
  readonly PhoneCall = PhoneCall;
  readonly Lock = Lock;
  readonly LogOut = LogOut;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly KeyRound = KeyRound;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertOctagon = AlertOctagon;

  currentPatient = this.authService.currentPatient;
  editingSection = signal<EditableSection | null>(null);

  // Personal
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  dateOfBirth = signal('');
  gender = signal<'male' | 'female' | ''>('male');

  // Medical (mock)
  bloodType = signal<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | ''>('A+');
  height = signal('178');
  weight = signal('75');
  allergies = signal('Пенициллин, цветочная пыльца');
  chronicConditions = signal('Гипертония');

  // Emergency contact (mock)
  emergencyName = signal('Сафар Каримов');
  emergencyRelation = signal('Отец');
  emergencyPhone = signal('+998 90 123 45 67');

  // Change password modal
  showPasswordModal = signal(false);
  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordError = signal('');
  passwordSaving = signal(false);
  passwordSaved = signal(false);

  // Inline saved-feedback per section
  savedSection = signal<EditableSection | null>(null);
  private savedTimer: ReturnType<typeof setTimeout> | null = null;

  // Avatar
  avatar = signal<string | null>(null);

  // Logout-all sessions modal
  showLogoutAllModal = signal(false);
  logoutAllSubmitting = signal(false);
  logoutAllDone = signal(false);

  // Delete-account modal
  showDeleteAccountModal = signal(false);
  deleteConfirmText = signal('');
  deleteSubmitting = signal(false);
  deleteError = signal('');

  passwordStrength = computed<{ score: number; label: string; cls: string }>(() => {
    const pwd = this.newPassword();
    if (!pwd) return { score: 0, label: '', cls: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { score, label: 'Слабый', cls: 'weak' };
    if (score === 3) return { score, label: 'Средний', cls: 'medium' };
    return { score, label: 'Надёжный', cls: 'strong' };
  });

  // Stats
  upcomingCount = computed(() =>
    this.appointmentsService.appointments().filter(a =>
      a.status === 'pending' || a.status === 'confirmed'
    ).length
  );
  completedCount = computed(() =>
    this.appointmentsService.appointments().filter(a => a.status === 'completed').length
  );
  cancelledCount = computed(() =>
    this.appointmentsService.appointments().filter(a => a.status === 'cancelled').length
  );
  documentsCount = signal(43);

  bloodTypeOptions: Array<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'> =
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor() {
    const patient = this.currentPatient();
    if (patient) {
      this.firstName.set(patient.first_name);
      this.lastName.set(patient.last_name);
      this.email.set(patient.email);
      this.phone.set(patient.phone);
      this.dateOfBirth.set(patient.date_of_birth || '');
      if (patient.gender) this.gender.set(patient.gender);
      this.avatar.set(patient.avatar || null);
    }
  }

  isEditing(section: EditableSection): boolean {
    return this.editingSection() === section;
  }

  startEdit(section: EditableSection): void {
    this.editingSection.set(section);
  }

  cancelEdit(section: EditableSection): void {
    if (section === 'personal') {
      const patient = this.currentPatient();
      if (patient) {
        this.firstName.set(patient.first_name);
        this.lastName.set(patient.last_name);
        this.email.set(patient.email);
        this.phone.set(patient.phone);
        this.dateOfBirth.set(patient.date_of_birth || '');
      }
    }
    this.editingSection.set(null);
  }

  save(section: EditableSection): void {
    if (section === 'personal') {
      this.authService.updatePatient({
        first_name: this.firstName().trim(),
        last_name: this.lastName().trim(),
        email: this.email().trim(),
        phone: this.phone().trim(),
        date_of_birth: this.dateOfBirth() || undefined,
        gender: this.gender() || undefined
      });
    }
    // Medical and emergency stay in component signals (no backend field yet)
    this.editingSection.set(null);
    this.flashSaved(section);
  }

  private flashSaved(section: EditableSection): void {
    if (this.savedTimer) clearTimeout(this.savedTimer);
    this.savedSection.set(section);
    this.savedTimer = setTimeout(() => this.savedSection.set(null), 2400);
  }

  initials(): string {
    const f = this.firstName().charAt(0);
    const l = this.lastName().charAt(0);
    return (f + l).toUpperCase();
  }

  formatDateOfBirth(): string {
    const d = this.dateOfBirth();
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  age(): number | null {
    const d = this.dateOfBirth();
    if (!d) return null;
    const birth = new Date(d);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  genderLabel(): string {
    if (this.gender() === 'male') return 'Мужской';
    if (this.gender() === 'female') return 'Женский';
    return '—';
  }

  bmi(): { value: string; label: string; cls: string } | null {
    const h = parseFloat(this.height());
    const w = parseFloat(this.weight());
    if (!h || !w) return null;
    const meters = h / 100;
    const v = w / (meters * meters);
    let label = 'Нормальный';
    let cls = 'normal';
    if (v < 18.5) { label = 'Недостаточный'; cls = 'low'; }
    else if (v >= 25 && v < 30) { label = 'Избыточный'; cls = 'over'; }
    else if (v >= 30) { label = 'Ожирение'; cls = 'obese'; }
    return { value: v.toFixed(1), label, cls };
  }

  changePassword(): void {
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
    this.passwordError.set('');
    this.passwordSaved.set(false);
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    if (this.passwordSaving()) return;
    this.showPasswordModal.set(false);
  }

  submitPasswordChange(): void {
    const current = this.currentPassword();
    const next = this.newPassword();
    const confirm = this.confirmPassword();

    if (!current) {
      this.passwordError.set('Введите текущий пароль');
      return;
    }
    if (next.length < 8) {
      this.passwordError.set('Новый пароль должен содержать минимум 8 символов');
      return;
    }
    if (next === current) {
      this.passwordError.set('Новый пароль должен отличаться от текущего');
      return;
    }
    if (next !== confirm) {
      this.passwordError.set('Пароли не совпадают');
      return;
    }

    this.passwordError.set('');
    this.passwordSaving.set(true);

    setTimeout(() => {
      this.passwordSaving.set(false);
      this.passwordSaved.set(true);
      setTimeout(() => {
        this.showPasswordModal.set(false);
      }, 1200);
    }, 800);
  }

  logoutAllDevices(): void {
    this.logoutAllDone.set(false);
    this.showLogoutAllModal.set(true);
  }

  closeLogoutAllModal(): void {
    if (this.logoutAllSubmitting()) return;
    this.showLogoutAllModal.set(false);
  }

  confirmLogoutAll(): void {
    this.logoutAllSubmitting.set(true);
    setTimeout(() => {
      this.logoutAllSubmitting.set(false);
      this.logoutAllDone.set(true);
      setTimeout(() => this.showLogoutAllModal.set(false), 1400);
    }, 700);
  }

  deleteAccount(): void {
    this.deleteConfirmText.set('');
    this.deleteError.set('');
    this.showDeleteAccountModal.set(true);
  }

  closeDeleteAccountModal(): void {
    if (this.deleteSubmitting()) return;
    this.showDeleteAccountModal.set(false);
  }

  confirmDeleteAccount(): void {
    if (this.deleteConfirmText().trim().toUpperCase() !== 'УДАЛИТЬ') {
      this.deleteError.set('Введите УДАЛИТЬ для подтверждения');
      return;
    }
    this.deleteError.set('');
    this.deleteSubmitting.set(true);
    setTimeout(() => {
      this.deleteSubmitting.set(false);
      this.showDeleteAccountModal.set(false);
      this.authService.logout();
    }, 900);
  }

  // Avatar upload
  triggerPhotoUpload(): void {
    this.photoInput?.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.avatar.set(dataUrl);
      this.authService.updatePatient({ avatar: dataUrl });
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.avatar.set(null);
    this.authService.updatePatient({ avatar: undefined });
  }

  // Stat-card navigation
  goToTab(tab: 'upcoming' | 'past' | 'cancelled'): void {
    this.router.navigate(['/patient/appointments'], { queryParams: { tab } });
  }

  goToDocuments(): void {
    this.router.navigate(['/patient/documents']);
  }
}
