import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent {
  feedbackText = '';
  isLoading = false;
  message = '';

  constructor(
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  submitFeedback(): void {
    if (!this.feedbackText.trim()) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading = true;
    this.message = '';

    this.feedbackService.addFeedback({
      userId,
      feedbackText: this.feedbackText
    }).subscribe({
      next: () => {
        this.message = 'Feedback submitted successfully!';
        this.feedbackText = '';
        this.isLoading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        this.message = err.error || 'Failed to submit feedback.';
        this.isLoading = false;
      }
    });
  }
}