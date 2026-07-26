import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.model';

const MAX_PICTURE_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: User | null = null;
  isLoading = true;
  isSaving = false;
  profilePictureUrl: string | null = null;

  editUsername = '';
  editMobileNumber = '';

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.editUsername = data.username;
        this.editMobileNumber = data.mobileNumber;
        this.profilePictureUrl = data.profilePictureUrl ? 'http://localhost:8080' + data.profilePictureUrl : null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onPictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Profile picture must be an image file.');
      input.value = '';
      return;
    }
    if (file.size > MAX_PICTURE_BYTES) {
      this.toastService.error('Profile picture is too large. Maximum size is 2MB.');
      input.value = '';
      return;
    }

    this.userService.uploadProfilePicture(file).subscribe({
      next: (res) => {
        this.profilePictureUrl = 'http://localhost:8080' + res.url;
        this.toastService.success('Profile picture updated.');
      },
      error: (err) => {
        this.toastService.error(err.error || 'Failed to upload profile picture.');
      }
    });
  }

  saveProfile(): void {
    if (!this.editUsername || !this.editMobileNumber) {
      this.toastService.error('Username and mobile number are required.');
      return;
    }
    if (!/^[7-9][0-9]{9}$/.test(this.editMobileNumber)) {
      this.toastService.error('Mobile number must be 10 digits and start with 7, 8 or 9.');
      return;
    }
    if (!this.profile) return;

    this.isSaving = true;
    this.userService.updateProfile({
      username: this.editUsername,
      mobileNumber: this.editMobileNumber,
      email: this.profile.email
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('Profile updated successfully.');
        this.loadProfile();
      },
      error: (err) => {
        this.isSaving = false;
        this.toastService.error(err.error || 'Failed to update profile.');
      }
    });
  }
}
