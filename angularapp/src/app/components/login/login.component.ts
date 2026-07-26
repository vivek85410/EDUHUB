import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showForgotPassword = false;
  showOtpVerification = false;

  // Forgot password flow
  forgotEmail = '';
  otpCode = '';
  newPassword = '';
  confirmPassword = '';
  resetStep: 'email' | 'otp' | 'password' = 'email';

  constructor(
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  login(): void {
    if (!this.model.email || !this.model.password) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.model).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.token) {
          const role = this.authService.getUserRole();
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];

          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else if (role?.toLowerCase() === 'educator') {
            this.router.navigate(['/educator/courses']);

          } else {
            this.router.navigate(['/mycourses']);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  toggleForgotPassword(): void {
    this.showForgotPassword = !this.showForgotPassword;
    this.errorMessage = '';
    this.successMessage = '';
    this.resetStep = 'email';
    this.forgotEmail = '';
    this.otpCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  sendOtp(): void {
    if (!this.forgotEmail) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword({ email: this.forgotEmail }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'OTP sent to your email.';
        this.resetStep = 'otp';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send OTP.';
      }
    });
  }

  verifyOtp(): void {

    if (!this.otpCode) {
      this.errorMessage = 'Please enter the OTP code.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .verifyResetOtp(
        this.forgotEmail,
        this.otpCode
      )
      .subscribe({
        next: (res) => {

          this.isLoading = false;

          this.successMessage =
            res.message ||
            'OTP verified successfully.';

          this.resetStep = 'password';
        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            'Invalid or expired OTP.';
        }
      });
  }

  resetPassword(): void {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword({
      email: this.forgotEmail,
      code: this.otpCode,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Password reset successfully. Please login.';
        setTimeout(() => {
          this.showForgotPassword = false;
          this.showOtpVerification = false;
          this.resetStep = 'email';
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password.';
      }
    });
  }
}