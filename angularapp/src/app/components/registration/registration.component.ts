import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    userRole: 'Student',
    authorizationKey: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showOtpVerification = false;
  otpCode = '';

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  register(): void {
    if (!this.user.username || !this.user.email || !this.user.password || !this.user.mobileNumber) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (!/^[7-9][0-9]{9}$/.test(this.user.mobileNumber)) {
      this.errorMessage = 'Mobile number must be 10 digits and start with 7, 8 or 9.';
      return;
    }
    if (this.user.userRole === 'Educator' && !this.user.authorizationKey) {
      this.errorMessage = 'Educator registration requires an authorization key.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      mobileNumber: this.user.mobileNumber,
      userRole: this.user.userRole,
      authorizationKey: this.user.userRole === 'Educator' ? this.user.authorizationKey : undefined
    }).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.successMessage = res.message;

        this.showOtpVerification = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  verifyEmail(): void {

    if (!this.otpCode) {
      this.errorMessage = 'Please enter OTP';
      return;
    }

    this.isLoading = true;

    this.authService.verifyRegistration(
        this.user.email,
        this.otpCode
    )
    .subscribe({
        next: (res) => {

          this.isLoading = false;

          this.successMessage =
            'Registration completed successfully';

          this.router.navigate(['/login']);
        },

        error: (err) => {

          this.isLoading = false;

          this.errorMessage =
            err.error?.message ||
            'Invalid or expired OTP';
        }
    });
  }
}
