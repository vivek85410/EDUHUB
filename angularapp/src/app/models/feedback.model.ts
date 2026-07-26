export interface Feedback {
    feedbackId?: number;
    userId: number;
    user?: { userId: number; username: string; email: string };
    feedbackText: string;
    date?: string;
  }
