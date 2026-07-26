import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-studentviewcourse',
  templateUrl: './studentviewcourse.component.html',
  styleUrls: ['./studentviewcourse.component.css']
})
export class StudentviewcourseComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  categories: string[] = [];
  isLoading = true;
  selectedCourse: Course | null = null;
  searchTerm = '';
  filterCategory = '';
  filterLevel = '';
  sortBy = '';
  enrolledCourseIds: Set<number> = new Set();

  currentPage = 1;
  pageSize = 9;

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isStudent(): boolean {
    return this.authService.getUserRole() === 'Student';
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCourses.length / this.pageSize));
  }

  get pagedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCourses.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnInit(): void {
    this.loadCourses();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchTerm = params['search'];
      }
      if (params['courseId']) {
        const id = Number(params['courseId']);
        this.courseService.getCourseById(id).subscribe({
          next: (data) => {
            if (data.length > 0) {
              this.selectedCourse = data[0];
            }
          }
        });
      }
    });
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.categories = [...new Set(data.map(c => c.category))].filter(Boolean);
        this.filterCourses();
        this.isLoading = false;
        if (this.isStudent) {
          this.loadEnrolledCourses();
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadEnrolledCourses(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    // getEnrollmentsByUserId is Educator-only server-side; students must use the
    // general endpoint, which the backend auto-scopes to the caller's own enrollments.
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => {
        this.enrolledCourseIds = new Set(
          enrollments.filter(e => e.status === 'Enrolled').map(e => e.courseId)
        );
      }
    });
  }

  isEnrolled(courseId: number): boolean {
    return this.enrolledCourseIds.has(courseId);
  }

  filterCourses(): void {
    let result = [...this.courses];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      );
    }

    if (this.filterCategory) {
      result = result.filter(c => c.category === this.filterCategory);
    }

    if (this.filterLevel) {
      result = result.filter(c => c.level === this.filterLevel);
    }

    // Sort. "Newest/Oldest First" is by creation order (courseId), not the course's own
    // scheduled start date, since a course's start date can be far in the future or past.
    switch (this.sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'date':
        result.sort((a, b) => (b.courseId ?? 0) - (a.courseId ?? 0));
        break;
      case 'date_desc':
        result.sort((a, b) => (a.courseId ?? 0) - (b.courseId ?? 0));
        break;
    }

    this.filteredCourses = result;
    this.currentPage = 1;
  }

  openCourseDetail(course: Course): void {
    this.selectedCourse = course;
  }

  enrollCourse(course: Course): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/courses?courseId=${course.courseId}` }
      });
      return;
    }

    if (!course.courseId) {
      return;
    }

    if (course.price && course.price > 0) {
      this.router.navigate(['/mock-payment'], {
        queryParams: { courseId: course.courseId, amount: course.price, title: course.title }
      });
      return;
    }

    this.enrollmentService.addEnrollment({ courseId: course.courseId }).subscribe({
      next: () => {
        this.loadEnrolledCourses();
        this.selectedCourse = null;
        this.toastService.success('Enrollment request submitted successfully.');
      },
      error: (err) => {
        const msg = err.error?.message || err.error || 'Enrollment failed';
        this.toastService.error(typeof msg === 'string' ? msg : 'Enrollment request already exists');
      }
    });
  }
}
