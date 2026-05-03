import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Loader2 } from 'lucide-angular';
import { AuthService } from '../core/services/auth.service';

type AuthMethod = 'phone' | 'login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  readonly Loader2 = Loader2;

  authMethod = signal<AuthMethod>('phone');

  // Phone tab
  phoneDigits = signal('');
  otpSent = signal(false);
  otp = signal('');
  otpRequesting = signal(false);
  otpVerifying = signal(false);
  resendCooldown = signal(0);
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  // Login tab
  login = signal('');
  password = signal('');

  errorMessage = signal('');
  isLoading = signal(false);

  formattedPhone = computed(() => this.formatPhone(this.phoneDigits()));
  isPhoneValid = computed(() => this.phoneDigits().length === 9);
  isOtpValid = computed(() => /^\d{6}$/.test(this.otp()));
  isCredentialsValid = computed(() => !!this.login().trim() && !!this.password());

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  setMethod(method: AuthMethod): void {
    this.authMethod.set(method);
    this.errorMessage.set('');
  }

  // ---- Phone tab ----
  onPhoneInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    this.phoneDigits.set(digits);
    this.errorMessage.set('');
  }

  onOtpInput(value: string): void {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    this.otp.set(digits);
    this.errorMessage.set('');
  }

  formatPhone(digits: string): string {
    if (!digits) return '';
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length > 2) parts.push(digits.slice(2, 5));
    if (digits.length > 5) parts.push(digits.slice(5, 7));
    if (digits.length > 7) parts.push(digits.slice(7, 9));
    return parts.join(' ');
  }

  requestOtp(): void {
    if (!this.isPhoneValid()) {
      this.errorMessage.set('Введите номер полностью');
      return;
    }
    this.errorMessage.set('');
    this.otpRequesting.set(true);
    setTimeout(() => {
      this.otpRequesting.set(false);
      this.otpSent.set(true);
      this.otp.set('');
      this.startResendCooldown();
    }, 800);
  }

  resendOtp(): void {
    if (this.resendCooldown() > 0) return;
    this.requestOtp();
  }

  private startResendCooldown(): void {
    this.resendCooldown.set(30);
    if (this.resendTimer) clearInterval(this.resendTimer);
    this.resendTimer = setInterval(() => {
      const left = this.resendCooldown() - 1;
      if (left <= 0) {
        this.resendCooldown.set(0);
        if (this.resendTimer) clearInterval(this.resendTimer);
        this.resendTimer = null;
      } else {
        this.resendCooldown.set(left);
      }
    }, 1000);
  }

  changePhone(): void {
    this.otpSent.set(false);
    this.otp.set('');
    this.errorMessage.set('');
    if (this.resendTimer) clearInterval(this.resendTimer);
    this.resendCooldown.set(0);
  }

  async verifyOtp(): Promise<void> {
    if (!this.isOtpValid()) {
      this.errorMessage.set('Введите 6-значный код');
      return;
    }
    this.errorMessage.set('');
    this.otpVerifying.set(true);
    try {
      const fullPhone = `+992${this.phoneDigits()}`;
      const success = await this.authService.loginByPhone(fullPhone, this.otp());
      if (success) {
        this.router.navigate(['/patient']);
      } else {
        this.errorMessage.set('Неверный код. Попробуйте снова.');
      }
    } finally {
      this.otpVerifying.set(false);
    }
  }

  // ---- Login tab ----
  async onSubmit(): Promise<void> {
    if (!this.isCredentialsValid()) {
      this.errorMessage.set('Введите логин и пароль');
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const success = await this.authService.login({
        email: this.login(),
        password: this.password()
      });

      if (success) {
        this.router.navigate(['/patient']);
      } else {
        this.errorMessage.set('Неверный логин или пароль');
      }
    } catch (error) {
      this.errorMessage.set('Произошла ошибка. Попробуйте снова.');
    } finally {
      this.isLoading.set(false);
    }
  }

}
