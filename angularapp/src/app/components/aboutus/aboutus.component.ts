import { Component } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { ContactQuery } from '../../models/contact.model';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  query: ContactQuery = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSubmitting = false;

  constructor(
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  submit(): void {
    if (!this.query.name || !this.query.email || !this.query.subject || !this.query.message) {
      this.toastService.error('All fields are required.');
      return;
    }

    this.isSubmitting = true;
    this.contactService.submitContact(this.query).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success("Thank you for reaching out. We'll get back to you soon.");
        this.query = { name: '', email: '', subject: '', message: '' };
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.error(err.error || 'Failed to submit your query. Please try again.');
      }
    });
  }
}
