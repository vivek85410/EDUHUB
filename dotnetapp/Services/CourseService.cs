
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Exceptions;
using dotnetapp.Data;
using dotnetapp.Models;
 
namespace dotnetapp.Services
{
    public class CourseService
    {
        private readonly ApplicationDbContext _context;
 
        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }
 
        // 1. Get all courses
        public async Task<IEnumerable<Course>> GetAllCourses()
        {
            return await _context.Courses.ToListAsync();
        }
 
        // 2. Get course by Id
        public async Task<Course> GetCourseById(int courseId)
        {
            return await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId);
        }
 
        // 3. Add course
        public async Task<bool> AddCourse(Course course)
        {
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.Title == course.Title);

            if (existingCourse != null)
            {
                throw new CourseException("A course with the same name already exists");
            }

            if (course.CourseStartDate.Date < DateTime.Today)
            {
                throw new CourseException("Course start date cannot be in the past");
            }

            if (course.CourseEndDate.Date < course.CourseStartDate.Date)
            {
                throw new CourseException("Course end date must be after the start date");
            }

            if (string.IsNullOrWhiteSpace(course.ThumbnailUrl))
            {
                throw new CourseException("A course thumbnail image is required");
            }

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            return true;
        }

        // 4. Update course
        public async Task<bool> UpdateCourse(int courseId, Course course)
        {
            var existingCourse = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (existingCourse == null)
            {
                return false;
            }

            // Only enforce not-in-the-past when the start date is actually being changed,
            // so editing an already-running course doesn't get blocked by its own history.
            if (course.CourseStartDate.Date != existingCourse.CourseStartDate.Date
                && course.CourseStartDate.Date < DateTime.Today)
            {
                throw new CourseException("Course start date cannot be in the past");
            }

            if (course.CourseEndDate.Date < course.CourseStartDate.Date)
            {
                throw new CourseException("Course end date must be after the start date");
            }

            existingCourse.Title = course.Title;
            existingCourse.Description = course.Description;
            existingCourse.CourseStartDate = course.CourseStartDate;
            existingCourse.CourseEndDate = course.CourseEndDate;
            existingCourse.Category = course.Category;
            existingCourse.Level = course.Level;
            existingCourse.Price = course.Price;

            if (!string.IsNullOrWhiteSpace(course.ThumbnailUrl))
            {
                existingCourse.ThumbnailUrl = course.ThumbnailUrl;
            }

            await _context.SaveChangesAsync();

            return true;
        }

        // 5. Delete course
        public async Task<bool> DeleteCourse(int courseId)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId);

            if (course == null)
            {
                return false;
            }

            bool hasActiveEnrollments = await _context.Enrollments
                .AnyAsync(e => e.CourseId == courseId && e.Status != "Rejected");

            if (hasActiveEnrollments)
            {
                throw new CourseException("Cannot delete a course that has pending or enrolled students");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return true;
        }

        // 6. Get courses by Id
        public async Task<IEnumerable<Course>> GetCourseByld(int courseId)
        {
            return await _context.Courses
                .Where(c => c.CourseId == courseId)
                .ToListAsync();
        }

        // 7. Get courses owned by a given educator (legacy/unowned courses fall back to visible-to-all)
        public async Task<IEnumerable<Course>> GetCoursesByEducatorId(int educatorId)
        {
            return await _context.Courses
                .Where(c => c.EducatorId == educatorId || c.EducatorId == null)
                .ToListAsync();
        }
    }
}
