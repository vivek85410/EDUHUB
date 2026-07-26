using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Exceptions;
using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/course")]
    public class CourseController : ControllerBase
    {
        private readonly CourseService cs;
        private readonly FileUploadService _fileUploadService;

        public CourseController(CourseService courseService, FileUploadService fileUploadService)
        {
            cs = courseService;
            _fileUploadService = fileUploadService;
        }

        // Upload a course thumbnail image (max 2MB), returns the URL to use in AddCourse/UpdateCourse
        [Authorize(Roles = "Educator")]
        [HttpPost("upload-thumbnail")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UploadThumbnail([FromForm] UploadThumbnailModel model)
        {
            if (model?.File == null || model.File.Length == 0)
            {
                return BadRequest("Please select a valid image file.");
            }

            var result = await _fileUploadService.UploadImage(model.File, 2 * 1024 * 1024);

            if (!result.Success)
            {
                return BadRequest(result.Error ?? "Invalid image file. Allowed types: jpg, jpeg, png, gif, webp (max 2MB).");
            }

            return Ok(new { url = result.Url });
        }

        // Get All Courses
        [Authorize(Roles = "Educator,Student")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetAllCourses()
        {
            var courses = await cs.GetAllCourses();
            return Ok(courses);
        }

        // Get Courses owned by the calling Educator (+ legacy unowned courses)
        [Authorize(Roles = "Educator")]
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<Course>>> GetMyCourses()
        {
            var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
            var courses = await cs.GetCoursesByEducatorId(callerUserId);
            return Ok(courses);
        }

        // Get Course By Id
        [Authorize(Roles = "Educator,Student")]
        [HttpGet("{courseId}")]
        public async Task<ActionResult<Course>> GetCourseById(int courseId)
        {
            var courses = await cs.GetCourseByld(courseId);

            if (courses == null || !courses.Any())
            {
                return NotFound("Cannot find any course");
            }

            return Ok(courses);
        }

        // Add Course
        [Authorize(Roles = "Educator")]
        [HttpPost]
        public async Task<ActionResult> AddCourse([FromBody] Course course)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
                course.EducatorId = callerUserId;

                var result = await cs.AddCourse(course);

                if (result)
                {
                    return Ok("Course added successfully");
                }

                return StatusCode(500, "Failed to add course");
            }
            catch (CourseException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Update Course
        [Authorize(Roles = "Educator")]
        [HttpPut("{courseId}")]
        public async Task<ActionResult> UpdateCourse(int courseId, [FromBody] Course course)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
                var existingCourse = await cs.GetCourseById(courseId);

                if (existingCourse == null)
                {
                    return NotFound("Cannot find any course");
                }

                if (existingCourse.EducatorId != null && existingCourse.EducatorId != callerUserId)
                {
                    return Forbid();
                }

                var result = await cs.UpdateCourse(courseId, course);

                if (!result)
                {
                    return NotFound("Cannot find any course");
                }

                return Ok("Course updated successfully");
            }
            catch (CourseException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Delete Course
        [Authorize(Roles = "Educator")]
        [HttpDelete("{courseId}")]
        public async Task<ActionResult> DeleteCourse(int courseId)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
                var existingCourse = await cs.GetCourseById(courseId);

                if (existingCourse == null)
                {
                    return NotFound("Cannot find any course");
                }

                if (existingCourse.EducatorId != null && existingCourse.EducatorId != callerUserId)
                {
                    return Forbid();
                }

                var result = await cs.DeleteCourse(courseId);

                if (!result)
                {
                    return NotFound("Cannot find any course");
                }

                return Ok("Course deleted successfully");
            }
            catch (CourseException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}