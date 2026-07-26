import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../services/toast.service';
import { Course } from '../../models/course.model';

const MAX_THUMBNAIL_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-educatoraddcourse',
  templateUrl: './educatoraddcourse.component.html',
  styleUrls: ['./educatoraddcourse.component.css']
})
export class EducatoraddcourseComponent {
  course: Course = {
    title: '',
    description: '',
    courseStartDate: '',
    courseEndDate: '',
    category: '',
    level: 'Beginner',
    price: null
  };
  isLoading = false;
  errorMessage = '';

  todayDate = new Date().toISOString().split('T')[0];

  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: string | null = null;

  constructor(
    private courseService: CourseService,
    private toastService: ToastService,
    public router: Router
  ) {}

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Thumbnail must be an image file (jpg, png, gif, webp).';
      input.value = '';
      return;
    }

    if (file.size > MAX_THUMBNAIL_BYTES) {
      this.errorMessage = 'Thumbnail image is too large. Maximum size is 2MB.';
      input.value = '';
      return;
    }

    this.errorMessage = '';
    this.thumbnailFile = file;
    this.thumbnailPreviewUrl = URL.createObjectURL(file);
  }

  addCourse(): void {
    if (!this.course.title || !this.course.description || !this.course.category ||
        !this.course.courseStartDate || !this.course.courseEndDate) {
      this.errorMessage = 'All required fields must be filled.';
      return;
    }
    if (this.course.courseStartDate < this.todayDate) {
      this.errorMessage = 'Course start date cannot be in the past.';
      return;
    }
    if (this.course.courseEndDate < this.course.courseStartDate) {
      this.errorMessage = 'End date must be after start date.';
      return;
    }
    if (!this.thumbnailFile) {
      this.errorMessage = 'A course thumbnail image is required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.uploadThumbnail(this.thumbnailFile).subscribe({
      next: (res) => {
        this.course.thumbnailUrl = res.url;
        this.submitCourse();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Failed to upload thumbnail.';
      }
    });
  }

  private submitCourse(): void {
    this.courseService.addCourse(this.course).subscribe({
      next: () => {
        this.toastService.success('Course added successfully.');
        this.router.navigate(['/educator/courses']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Failed to add course.';
      }
    });
  }
}
