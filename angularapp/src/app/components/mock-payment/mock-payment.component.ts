import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-mock-payment',
  templateUrl: './mock-payment.component.html',
  styleUrls: ['./mock-payment.component.css']
})
export class MockPaymentComponent implements OnInit {
  courseId: number | null = null;
  amount = 0;
  courseTitle = '';

  cardNumber = '';
  cardName = '';
  expiry = '';
  cvv = '';

  isProcessing = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private enrollmentService: EnrollmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'] ? Number(params['courseId']) : null;
      this.amount = params['amount'] ? Number(params['amount']) : 0;
      this.courseTitle = params['title'] || 'this course';
    });

    if (!this.courseId) {
      this.router.navigate(['/courses']);
    }
  }

  pay(): void {
    if (!this.cardNumber || !this.cardName || !this.expiry || !this.cvv) {
      this.errorMessage = 'All payment fields are required.';
      return;
    }
    if (!/^\d{16}$/.test(this.cardNumber.replace(/\s/g, ''))) {
      this.errorMessage = 'Card number must be 16 digits.';
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(this.expiry)) {
      this.errorMessage = 'Expiry must be in MM/YY format.';
      return;
    }
    if (!/^\d{3,4}$/.test(this.cvv)) {
      this.errorMessage = 'CVV must be 3 or 4 digits.';
      return;
    }
    if (!this.courseId) return;

    this.errorMessage = '';
    this.isProcessing = true;

    // Simulated payment gateway delay
    setTimeout(() => {
      this.paymentService.mockPay({ courseId: this.courseId!, amount: this.amount }).subscribe({
        next: () => {
          this.enrollmentService.addEnrollment({ courseId: this.courseId! }).subscribe({
            next: () => {
              this.isProcessing = false;
              this.toastService.success('Payment successful! Enrollment request submitted.');
              this.router.navigate(['/courses']);
            },
            error: (err) => {
              this.isProcessing = false;
              const msg = err.error?.message || err.error || 'Payment succeeded but enrollment failed.';
              this.toastService.error(typeof msg === 'string' ? msg : 'Enrollment failed after payment.');
            }
          });
        },
        error: () => {
          this.isProcessing = false;
          this.errorMessage = 'Payment failed. Please try again.';
        }
      });
    }, 1500);
  }
}
