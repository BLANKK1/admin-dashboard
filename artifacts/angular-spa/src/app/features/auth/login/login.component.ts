import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['general', [Validators.required]],
    });
  }

  isInvalid(field: string): boolean {
    const c = this.loginForm.get(field);
    return !!(c?.invalid && c.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { userId, password, role } = this.loginForm.value as {
      userId: string;
      password: string;
      role: string;
    };
    this.auth.login({ userId, password, role }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Invalid credentials. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
