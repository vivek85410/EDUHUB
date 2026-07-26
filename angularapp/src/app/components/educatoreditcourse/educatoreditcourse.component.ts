import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../services/toast.service';
import { Course } from '../../models/course.model';

const MAX_THUMBNAIL_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-educatoreditcourse',
  templateUrl: './educatoreditcourse.component.html',
  styleUrls: ['./educatoreditcourse.component.css']
})
export class EducatoreditcourseComponent implements OnInit {
  course: Course = {
    title: '',
    description: '',
    courseStartDate: '',
    courseEndDate: '',
    category: '',
    level: 'Beginner',
    price: null
  };
  originalStartDate = '';
  courseId: number | null = null;
  isLoading = false;
  isLoadingCourse = true;
  errorMessage = '';

  todayDate = new Date().toISOString().split('T')[0];

  thumbnailFile: File | null = null;
  thumbnailPreviewUrl: string | null = null;

  constructor(
    private courseService: CourseService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = Number(params['courseId']);
      if (this.courseId) {
        this.loadCourse();
      }
    });
  }

  loadCourse(): void {
    if (!this.courseId) return;
    this.isLoadingCourse = true;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        if (data.length > 0) {
          const c = data[0];
          this.course = {
            title: c.title,
            description: c.description,
            courseStartDate: c.courseStartDate,
            courseEndDate: c.courseEndDate,
            category: c.category,
            level: c.level,
            price: c.price ?? null,
            thumbnailUrl: c.thumbnailUrl
          };
          this.originalStartDate = c.courseStartDate;
          if (c.thumbnailUrl) {
            this.thumbnailPreviewUrl = 'http://localhost:8080' + c.thumbnailUrl;
          }
        }
        this.isLoadingCourse = false;
      },
      error: () => {
        this.isLoadingCourse = false;
        this.errorMessage = 'Failed to load course.';
      }
    });
  }

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

  updateCourse(): void {
    if (!this.courseId) return;
    if (!this.course.title || !this.course.description || !this.course.category ||
        !this.course.courseStartDate || !this.course.courseEndDate) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    // Only block a past start date if it was actually changed from the original.
    if (this.course.courseStartDate !== this.originalStartDate && this.course.courseStartDate < this.todayDate) {
      this.errorMessage = 'Course start date cannot be in the past.';
      return;
    }
    if (this.course.courseEndDate < this.course.courseStartDate) {
      this.errorMessage = 'End date must be after start date.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.thumbnailFile) {
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
    } else {
      this.submitCourse();
    }
  }

  private submitCourse(): void {
    if (!this.courseId) return;
    this.courseService.updateCourse(this.courseId, this.course).subscribe({
      next: () => {
        this.toastService.success('Course updated successfully.');
        this.router.navigate(['/educator/courses']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error || 'Failed to update course.';
      }
    });
  }
}
