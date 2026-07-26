import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole: string | null = null;
  username: string | null = null;
  profilePictureUrl: string | null = null;
  isMobileMenuOpen = false;
  showSearchDropdown = false;
  searchTerm = '';
  courses: Course[] = [];

  pendingCount$ = this.notificationService.pendingCount$;

  private wasLoggedIn = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.username = this.authService.getUsername();
    this.syncEducatorNotifications();
    this.loadProfilePicture();
  }

  ngDoCheck(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
    this.username = this.authService.getUsername();
    if (this.isLoggedIn !== this.wasLoggedIn) {
      this.wasLoggedIn = this.isLoggedIn;
      this.syncEducatorNotifications();
      this.loadProfilePicture();
    }
  }

  private syncEducatorNotifications(): void {
    if (this.isLoggedIn && this.userRole === 'Educator') {
      this.notificationService.start();
    } else {
      this.notificationService.stop();
    }
  }

  private loadProfilePicture(): void {
    if (this.isLoggedIn) {
      this.userService.getProfile().subscribe({
        next: (user) => this.profilePictureUrl = user.profilePictureUrl ? 'http://localhost:8080' + user.profilePictureUrl : null,
        error: () => {}
      });
    } else {
      this.profilePictureUrl = null;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/courses'], {
        queryParams: { search: this.searchTerm.trim() }
      });
      this.showSearchDropdown = false;
      this.searchTerm = '';
    }
  }

  onSearchInput(): void {
    if (this.searchTerm.length >= 2) {
      this.courseService.getAllCourses().subscribe({
        next: (data) => {
          const term = this.searchTerm.toLowerCase();
          this.courses = data.filter(
            (c) =>
              c.title.toLowerCase().includes(term) ||
              c.category.toLowerCase().includes(term) ||
              c.level.toLowerCase().includes(term)
          );
          this.showSearchDropdown = this.courses.length > 0;
        }
      });
    } else {
      this.showSearchDropdown = false;
      this.courses = [];
    }
  }

  goToCourse(courseId: number | undefined): void {
    if (courseId) {
      this.router.navigate(['/courses'], {
        queryParams: { courseId }
      });
    }
    this.showSearchDropdown = false;
    this.searchTerm = '';
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userRole = null;
    this.notificationService.stop();
    this.router.navigate(['/home']);
  }
}
