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

```

Prerequisites
Install the following before running EDUHUB:

.NET 6 SDK
Node.js and npm
SQL Server (local or remote)
Git
Running Locally
1. Configure the backend
Configure the backend with:

A SQL Server connection string.
JWT issuer and audience settings.
RSA public and private key files at the paths expected by the backend.
SMTP settings for registration and password-recovery OTP emails.
Keep credentials and private keys out of source control. Use local development secrets or environment variables for sensitive settings.

2. Apply database migrations
From the repository root, run:

cd dotnetapp
dotnet tool restore
dotnet ef database update

3. Start the backend API
From the dotnetapp directory:

dotnet run

The API is configured to run at http://localhost:8080 with the current launch profile. In Development mode, Swagger UI is available at:

http://localhost:8080/swagger

4. Start the Angular frontend
Open another terminal and run:

cd angularapp
npm install
npm start

The Angular development server is configured for:
http://localhost:4200

The frontend services currently call the API at http://localhost:8080. If you run the API at a different address, update the frontend API base URLs accordingly.

Testing
Run the Angular tests with:

cd angularapp
npm test

Run backend tests using the solution and test project configuration in dotnetapp and TestProject.

Notes
Email-based OTP flows require valid SMTP configuration.
Uploaded learning materials and profile/course images are stored by the backend under its web root.
Configure local database, email, and key settings before running the application.
