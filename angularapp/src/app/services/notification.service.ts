import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { EnrollmentService } from './enrollment.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pendingCountSubject = new BehaviorSubject<number>(0);
  pendingCount$ = this.pendingCountSubject.asObservable();

  private pollSubscription: Subscription | null = null;

  constructor(private enrollmentService: EnrollmentService) {}

  start(): void {
    if (this.pollSubscription) {
      return;
    }
    this.pollSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.enrollmentService.getPendingEnrollments())
      )
      .subscribe({
        next: (enrollments) => this.pendingCountSubject.next(enrollments.length),
        error: () => {}
      });
  }

  stop(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = null;
    this.pendingCountSubject.next(0);
  }

  refreshNow(): void {
    this.enrollmentService.getPendingEnrollments().subscribe({
      next: (enrollments) => this.pendingCountSubject.next(enrollments.length),
      error: () => {}
    });
  }
}
