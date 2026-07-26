import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from '../../services/material.service';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmService } from '../../services/confirm.service';
import { Material } from '../../models/material.model';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-educatormaterials',
  templateUrl: './educatormaterials.component.html',
  styleUrls: ['./educatormaterials.component.css'],
})
export class EducatormaterialsComponent implements OnInit {
  materials: Material[] = [];
  courses: Course[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCourseId = '';
  showAddForm = false;
  showUploadForm = false;

  // Add by URL form
  newMaterial: Material = {
    courseId: 0,
    title: '',
    description: '',
    url: '',
    contentType: 'link'
  };

  // File upload form
  uploadModel = {
    courseId: '',
    title: '',
    description: '',
    file: null as File | null
  };

  uploadProgress = 0;
  addMessage = '';
  isUploading = false;

  constructor(
    private materialService: MaterialService,
    private courseService: CourseService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    this.loadCourses();
    this.route.queryParams.subscribe(params => {
      if (params['courseId']) {
        this.selectedCourseId = params['courseId'];
        this.newMaterial.courseId = Number(params['courseId']);
        this.uploadModel.courseId = params['courseId'];
      }
    });
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.materialService.getMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (data) => { this.courses = data; }
    });
  }

  get filteredMaterials(): Material[] {
    let result = [...this.materials];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(term) || (m.description?.toLowerCase().includes(term)));
    }
    if (this.selectedCourseId) {
      result = result.filter(m => m.courseId === Number(this.selectedCourseId));
    }
    return result;
  }

  getCourseTitle(courseId: number): string {
    return this.courses.find(c => c.courseId === courseId)?.title || 'Unknown Course';
  }

  // Add material by URL
  addMaterialByUrl(): void {
    if (!this.newMaterial.title || !this.newMaterial.url || !this.newMaterial.courseId) {
      this.addMessage = 'Title, URL, and Course are required.';
      return;
    }
    this.isUploading = true;
    this.materialService.addMaterial({
      courseId: this.newMaterial.courseId,
      title: this.newMaterial.title,
      description: this.newMaterial.description,
      url: this.newMaterial.url,
      contentType: 'link'
    }).subscribe({
      next: () => {
        this.addMessage = 'Material added successfully!';
        this.loadMaterials();
        this.resetForms();
        this.isUploading = false;
        setTimeout(() => this.addMessage = '', 3000);
      },
      error: (err) => {
        this.addMessage = err.error || 'Failed to add material.';
        this.isUploading = false;
      }
    });
  }

  // File upload
  onFileSelected(event: any): void {
    this.uploadModel.file = event.target.files[0] || null;
  }

  uploadFile(): void {
    if (!this.uploadModel.file || !this.uploadModel.title || !this.uploadModel.courseId) {
      this.addMessage = 'Title, file, and course are required.';
      return;
    }

    const formData = new FormData();
    formData.append('CourseId', this.uploadModel.courseId);
    formData.append('Title', this.uploadModel.title);
    formData.append('Description', this.uploadModel.description || '');
    formData.append('File', this.uploadModel.file, this.uploadModel.file.name);

    this.isUploading = true;
    this.materialService.uploadMaterial(formData).subscribe({
      next: () => {
        this.addMessage = 'File uploaded successfully!';
        this.loadMaterials();
        this.resetForms();
        this.isUploading = false;
        setTimeout(() => this.addMessage = '', 3000);
      },
      error: (err) => {
        this.addMessage = err.error?.message || 'Failed to upload file.';
        this.isUploading = false;
      }
    });
  }

  async deleteMaterial(materialId: number | undefined): Promise<void> {
    if (!materialId) return;
    const ok = await this.confirmService.confirm('Delete this material?', 'Delete material');
    if (!ok) return;
    this.materialService.deleteMaterial(materialId).subscribe({
      next: () => {
        this.toastService.success('Material deleted successfully.');
        this.loadMaterials();
      },
      error: (err) => { this.toastService.error(err.error || 'Failed to delete material.'); }
    });
  }

  resetForms(): void {
    this.showAddForm = false;
    this.showUploadForm = false;
    this.newMaterial = { courseId: this.selectedCourseId ? Number(this.selectedCourseId) : 0, title: '', description: '', url: '', contentType: 'link' };
    this.uploadModel = { courseId: this.selectedCourseId || '', title: '', description: '', file: null };
  }

  getContentTypeIcon(type: string): string {
    const t = type?.toLowerCase() || '';
    if (t.includes('pdf') || t === 'pdf') return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
    if (t.includes('video') || t.includes('mp4') || t.includes('avi') || t.includes('mov') || t.includes('mkv')) return 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z';
    if (t.includes('doc') || t.includes('text')) return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    return 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1';
  }
}