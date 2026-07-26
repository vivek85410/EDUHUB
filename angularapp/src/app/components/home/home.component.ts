import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  currentSlide = 0;
  slideInterval: any;

  slides = [
    {
      title: 'Learn Without Limits',
      subtitle: 'Access world-class education anytime, anywhere',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=400&fit=crop'
    },
    {
      title: 'Expert Educators',
      subtitle: 'Learn from industry professionals and experienced instructors',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=1200&h=400&fit=crop'
    },
    {
      title: 'Interactive Learning',
      subtitle: 'Engage with video content, materials, and peer feedback',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&h=400&fit=crop'
    }
  ];

  services = [
    {
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      title: 'Rich Course Library',
      desc: 'Diverse courses across multiple categories and skill levels'
    },
    {
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      title: 'Video-Based Learning',
      desc: 'High-quality video content with embedded materials'
    },
    {
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      title: 'Certified Learning',
      desc: 'Track progress and get enrollment confirmations'
    }
  ];

  constructor(
    private courseService: CourseService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  loadCourses(): void {
    this.isLoading = true;
    // Try with auth first, if fails try without
    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data.slice(0, 6);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  exploreCourses(): void {
    this.router.navigate(['/courses']);
  }

  get truncatedCourses(): Course[] {
    return this.courses.slice(0, 3);
  }
}