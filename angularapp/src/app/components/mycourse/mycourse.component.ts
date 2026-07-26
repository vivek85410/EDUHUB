import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { EnrollmentService } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-mycourse',
  templateUrl: './mycourse.component.html',
  styleUrls: ['./mycourse.component.css']
})
export class MycourseComponent implements OnInit, OnDestroy {
  enrollments: Enrollment[] = [];
  isLoading = true;

  private pollSubscription: Subscription | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyCourses();
    // Auto-refresh so an educator's approve/reject decision is reflected without a manual reload.
    this.pollSubscription = interval(20000).subscribe(() => this.loadMyCourses(true));
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  loadMyCourses(silent = false): void {
    if (!silent) {
      this.isLoading = true;
    }
    const userId = this.authService.getUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }

    // Get all enrollments for the current user (the endpoint filters by user for Student role)
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data.filter(e => e.status === 'Enrolled');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openCourse(enrollment: Enrollment): void {
    this.router.navigate(['/course-detail', enrollment.courseId]);
  }

  getStatusClass(status: string | undefined): string {
    switch(status) {
      case 'Enrolled': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
