import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from '../../services/enrollment.service';
import { NotificationService } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-enrollmentlist',
  templateUrl: './enrollmentlist.component.html',
  styleUrls: ['./enrollmentlist.component.css']
})
export class EnrollmentlistComponent implements OnInit {
  enrollments: Enrollment[] = [];
  isLoading = true;
  actionMessage = '';

  constructor(
    private enrollmentService: EnrollmentService,
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.enrollmentService.getPendingEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  approveEnrollment(id: number | undefined): void {
    if (!id) return;
    this.enrollmentService.approveEnrollment(id).subscribe({
      next: (msg) => {
        this.toastService.success(typeof msg === 'string' ? msg : 'Enrollment approved');
        this.loadEnrollments();
        this.notificationService.refreshNow();
      },
      error: (err) => {
        this.toastService.error(err.error || 'Failed to approve enrollment');
      }
    });
  }

  rejectEnrollment(id: number | undefined): void {
    if (!id) return;
    this.enrollmentService.rejectEnrollment(id).subscribe({
      next: (msg) => {
        this.toastService.success(typeof msg === 'string' ? msg : 'Enrollment rejected');
        this.loadEnrollments();
        this.notificationService.refreshNow();
      },
      error: (err) => {
        this.toastService.error(err.error || 'Failed to reject enrollment');
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Enrolled': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
