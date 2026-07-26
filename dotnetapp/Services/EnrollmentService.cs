using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Exceptions;
using dotnetapp.Models;


namespace dotnetapp.Services
{
    public class EnrollmentService
    {
        private readonly ApplicationDbContext db;
        private readonly IEmailService _emailService;

        public EnrollmentService(ApplicationDbContext db1, IEmailService emailService)
        {
            db = db1;
            _emailService = emailService;
        }

        // Never send the (plaintext-adjacent) password field back out once a nested User is serialized.
        private static void ScrubPassword(Enrollment? enrollment)
        {
            if (enrollment?.User != null)
            {
                enrollment.User.Password = string.Empty;
            }
        }

        private static void ScrubPasswords(IEnumerable<Enrollment> enrollments)
        {
            foreach (var e in enrollments)
            {
                ScrubPassword(e);
            }
        }

        // Get All Enrollments in list
        public async Task<IEnumerable<Enrollment>> GetAllEnrollments()
        {
            var enrollments = await db.Enrollments.Include(e => e.User).Include(e => e.Course).ToListAsync();
            ScrubPasswords(enrollments);
            return enrollments;
        }

        // Get Enrollment By Id
        public async Task<Enrollment> GetEnrollmentById(int enrollmentId)
        {
            var enrollment = await db.Enrollments.Include(e => e.User).Include(e => e.Course).FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);
            ScrubPassword(enrollment);
            return enrollment;
        }

        // Add Enrollment
        public async Task<bool> AddEnrollment(Enrollment enrollment)
        {
            bool alreadyExists = await db.Enrollments.AnyAsync(e =>
                e.UserId == enrollment.UserId &&
                e.CourseId == enrollment.CourseId);

            if (alreadyExists)
            {
                throw new EnrollmentException(
                    "Enrollment request already exists");
            }

            enrollment.EnrollmentDate = DateTime.Now;
            enrollment.Status = "Pending";

            await db.Enrollments.AddAsync(enrollment);

            await db.SaveChangesAsync();

            return true;
        }

        // Update Enrollment by id.
        public async Task<bool> UpdateEnrollment(int enrollmentId, Enrollment enrollment)
        {
            var existingEnrollment = await db.Enrollments
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (existingEnrollment == null)
            {
                return false;
            }
            existingEnrollment.Status = enrollment.Status;

            await db.SaveChangesAsync();

            return true;
        }

        // Delete Enrollment by id.
        public async Task<bool> DeleteEnrollment(int enrollmentId)
        {
            var enrollment = await db.Enrollments
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
            {
                return false;
            }

            db.Enrollments.Remove(enrollment);
            await db.SaveChangesAsync();

            return true;
        }

        // Get Enrollments By UserId
        public async Task<IEnumerable<Enrollment>> GetEnrollmentsByUserId(int userId)
        {
            var enrollments = await db.Enrollments.Include(e => e.User).Include(e => e.Course).Where(e => e.UserId == userId).ToListAsync();
            ScrubPasswords(enrollments);
            return enrollments;
        }

        //Get Entrollment by course Id
        public async Task<IEnumerable<Enrollment>> GetEnrollmentsByCourseId(int courseId)
        {
            var enrollments = await db.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();
            ScrubPasswords(enrollments);
            return enrollments;
        }

        //Get pending requests (optionally scoped to a given educator's own courses)
        public async Task<IEnumerable<Enrollment>> GetPendingEnrollments(int? educatorId = null)
        {
            var query = db.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .Where(e => e.Status == "Pending");

            if (educatorId.HasValue)
            {
                query = query.Where(e => e.Course != null && (e.Course.EducatorId == educatorId.Value || e.Course.EducatorId == null));
            }

            var enrollments = await query.ToListAsync();
            ScrubPasswords(enrollments);
            return enrollments;
        }

        //Accept Request
        public async Task<bool> ApproveEnrollment(int enrollmentId)
        {
            var enrollment = await db.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
                return false;

            enrollment.Status = "Enrolled";

            await db.SaveChangesAsync();

            if (enrollment.User != null && !string.IsNullOrEmpty(enrollment.User.Email))
            {
                var courseName = enrollment.Course?.Title ?? "your course";
                await _emailService.SendEmailAsync(
                    enrollment.User.Email,
                    "Enrollment Approved",
                    $"<p>Good news! Your enrollment request for <strong>{courseName}</strong> has been <strong>approved</strong>. You can now access the course.</p>");
            }

            return true;
        }

        //Reject Request
        public async Task<bool> RejectEnrollment(int enrollmentId)
        {
            var enrollment = await db.Enrollments
                .Include(e => e.User)
                .Include(e => e.Course)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
                return false;

            enrollment.Status = "Rejected";

            await db.SaveChangesAsync();

            if (enrollment.User != null && !string.IsNullOrEmpty(enrollment.User.Email))
            {
                var courseName = enrollment.Course?.Title ?? "the course";
                await _emailService.SendEmailAsync(
                    enrollment.User.Email,
                    "Enrollment Rejected",
                    $"<p>Your enrollment request for <strong>{courseName}</strong> has been <strong>rejected</strong> by the educator. Please contact support if you have questions.</p>");
            }

            return true;
        }
    }
}


