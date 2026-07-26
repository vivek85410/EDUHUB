import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Feedback } from '../../models/feedback.model';

@Component({
  selector: 'app-userviewfeedback',
  templateUrl: './userviewfeedback.component.html',
  styleUrls: ['./userviewfeedback.component.css']
})
export class UserviewfeedbackComponent implements OnInit {
  feedbacks: Feedback[] = [];
  isLoading = true;

  currentPage = 1;
  pageSize = 6;

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.feedbackService.getFeedbacksByUserId(userId).subscribe({
      next: (data) => {
        this.feedbacks = data.sort((a, b) => (b.feedbackId ?? 0) - (a.feedbackId ?? 0));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  async deleteFeedback(feedbackId: number | undefined): Promise<void> {
    if (!feedbackId) return;
    const ok = await this.confirmService.confirm('Delete this feedback entry?', 'Delete feedback');
    if (!ok) return;

    this.feedbackService.deleteFeedback(feedbackId).subscribe({
      next: () => {
        this.toastService.success('Feedback deleted.');
        this.loadFeedbacks();
      },
      error: (err) => {
        this.toastService.error(err.error || 'Failed to delete feedback.');
      }
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.feedbacks.length / this.pageSize));
  }

  get pagedFeedbacks(): Feedback[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.feedbacks.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
