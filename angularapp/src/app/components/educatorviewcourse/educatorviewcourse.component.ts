import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-educatorviewcourse',
  templateUrl: './educatorviewcourse.component.html',
  styleUrls: ['./educatorviewcourse.component.css']
})
export class EducatorviewcourseComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;

  currentPage = 1;
  pageSize = 9;

  constructor(
    private courseService: CourseService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getMyCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.currentPage = 1;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  paidCoursesCount(): number {
    return this.courses.filter(c => c.price && c.price > 0).length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.courses.length / this.pageSize));
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.courses.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  addCourse(): void {
    this.router.navigate(['/educator/addcourse']);
  }

  editCourse(courseId: number | undefined): void {
    if (courseId) {
      this.router.navigate(['/educator/editcourse', courseId]);
    }
  }

  manageMaterials(courseId: number | undefined): void {
    if (courseId) {
      this.router.navigate(['/educator/materials'], {
        queryParams: { courseId }
      });
    }
  }

  async deleteCourse(courseId: number | undefined): Promise<void> {
    if (!courseId) return;
    const ok = await this.confirmService.confirm('Are you sure you want to delete this course? This cannot be undone.', 'Delete course');
    if (!ok) return;

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.toastService.success('Course deleted successfully.');
        this.loadCourses();
      },
      error: (err) => {
        this.toastService.error(err.error || 'Failed to delete course');
      }
    });
  }
}
