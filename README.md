# EDUHUB

EDUHUB is a full-stack online learning platform built to connect students and educators. Students can explore courses, enroll, access course materials, and manage their learning profiles. Educators can create and manage courses, upload learning resources, and review course enrollments and student feedback.

The application uses an Angular frontend and an ASP.NET Core Web API backend, with SQL Server for persistent application data.

## Features

### For students
- Register and sign in to a student account.
- Verify registration using an email OTP.
- Browse available courses and view course details.
- Enroll in courses and view enrolled courses.
- Access course materials, including documents, presentations, images, and videos.
- Submit and manage course feedback.
- Update profile information and upload a profile picture.
- Use the password recovery flow with email OTP verification.

### For educators
- Register and sign in to an educator account.
- Create, view, edit, and delete courses.
- Upload course thumbnails and course learning materials.
- Review course enrollments.
- View student feedback.

### General
- Role-based access for student and educator workflows.
- JWT-based authentication for protected API endpoints.
- Contact form for submitting inquiries.
- Responsive Angular user interface.
- Swagger API documentation available when the backend runs in Development mode.

> **Payment notice:** The payment flow is a mock/demo implementation. It records a simulated payment and is not connected to a real payment provider.

## Technology Stack

**Frontend**
- Angular 16
- TypeScript
- RxJS
- Tailwind CSS
- Three.js

**Backend**
- ASP.NET Core Web API (.NET 6)
- Entity Framework Core
- ASP.NET Core Identity
- JWT authentication
- RSA signing keys
- MailKit for email delivery
- Swagger / OpenAPI

**Database**
- Microsoft SQL Server

## Project Structure

```text
.
├── angularapp/    # Angular frontend
├── dotnetapp/     # ASP.NET Core API, data models, services, and migrations
└── TestProject/   # Project tests
