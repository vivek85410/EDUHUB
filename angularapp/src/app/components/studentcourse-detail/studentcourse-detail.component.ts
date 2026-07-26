import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { MaterialService } from '../../services/material.service';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';
import { Material } from '../../models/material.model';

@Component({
  selector: 'app-studentcourse-detail',
  templateUrl: './studentcourse-detail.component.html',
  styleUrls: ['./studentcourse-detail.component.css']
})
export class StudentcourseDetailComponent implements OnInit {
  course: Course | null = null;
  materials: Material[] = [];
  videoMaterials: Material[] = [];
  otherMaterials: Material[] = [];
  isLoading = true;
  feedbackText = '';
  feedbackMessage = '';

  constructor(
    private courseService: CourseService,
    private materialService: MaterialService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courseId = Number(params['courseId']);
      if (courseId) {
        this.loadCourse(courseId);
        this.loadMaterials(courseId);
      }
    });
  }

  loadCourse(courseId: number): void {
    this.courseService.getCourseById(courseId).subscribe({
      next: (data) => {
        this.course = data.length > 0 ? data[0] : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadMaterials(courseId: number): void {
    this.materialService.getMaterialsByCourseId(courseId).subscribe({
      next: (data) => {
        this.materials = data;
        this.videoMaterials = data.filter(m => 
          m.contentType?.toLowerCase().includes('video') || 
          m.contentType?.toLowerCase().includes('mp4') ||
          m.contentType?.toLowerCase().includes('avi') ||
          m.contentType?.toLowerCase().includes('mov') ||
          m.contentType?.toLowerCase().includes('mkv')
        );
        this.otherMaterials = data.filter(m => 
          !m.contentType?.toLowerCase().includes('video') && 
          !m.contentType?.toLowerCase().includes('mp4') &&
          !m.contentType?.toLowerCase().includes('avi') &&
          !m.contentType?.toLowerCase().includes('mov') &&
          !m.contentType?.toLowerCase().includes('mkv')
        );
      }
    });
  }

  get videoUrl(): string | null {
    if (this.videoMaterials.length > 0) {
      return `http://localhost:8080${this.videoMaterials[0].url}`;
    }
    return null;
  }

  submitFeedback(): void {
    if (!this.feedbackText.trim()) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.feedbackService.addFeedback({
      userId,
      feedbackText: this.feedbackText
    }).subscribe({
      next: () => {
        this.feedbackMessage = 'Feedback submitted successfully!';
        this.feedbackText = '';
        setTimeout(() => this.feedbackMessage = '', 3000);
      },
      error: (err) => {
        this.feedbackMessage = err.error || 'Failed to submit feedback.';
      }
    });
  }
}