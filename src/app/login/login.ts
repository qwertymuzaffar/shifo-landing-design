import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const success = await this.authService.login({
        email: this.email(),
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

  onForgotPassword(): void {
    alert('Функция восстановления пароля будет реализована позже');
  }
}
