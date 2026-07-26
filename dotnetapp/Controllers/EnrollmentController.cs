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
    [Route("api/enrollment")]
    public class EnrollmentController : ControllerBase
    {
        private readonly EnrollmentService _enrollmentService;

        public EnrollmentController(EnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        // 1. Get All Enrollments
        [Authorize(Roles = "Educator,Student")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetAllEnrollments()
        {
            if (User.IsInRole("Educator"))
            {
                var allEnrollments = await _enrollmentService.GetAllEnrollments();
                return Ok(allEnrollments);
            }
            var userId = int.Parse(User.FindFirst("UserId")!.Value);

            var enrollments = await _enrollmentService.GetEnrollmentsByUserId(userId);
            return Ok(enrollments);
        }

        // 2. Get Enrollment By Id
        [Authorize(Roles = "Student")]
        [HttpGet("{enrollmentId}")]
        public async Task<ActionResult<Enrollment>> GetEnrollmentById(int enrollmentId)
        {
            var enrollment =
                await _enrollmentService
                    .GetEnrollmentById(enrollmentId);

            if (enrollment == null)
            {
                return NotFound("Cannot find any enrollment");
            }

            var userId =
                int.Parse(User.FindFirst("UserId")!.Value);

            if (enrollment.UserId != userId)
            {
                return Forbid();
            }

            return Ok(enrollment);
        }

        // 3. Add Enrollment
        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<ActionResult> AddEnrollment([FromBody] Enrollment enrollment)
        {
            try
            {
                var userId = int.Parse(
                    User.FindFirst("UserId")!.Value);

                enrollment.UserId = userId;

                var result =
                    await _enrollmentService.AddEnrollment(enrollment);

                return Ok("Enrollment added successfully");
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

        // 4. Update Enrollment
        [Authorize(Roles = "Educator")]
        [HttpPut("{enrollmentId}")]
        public async Task<ActionResult> UpdateEnrollment(int enrollmentId, [FromBody] Enrollment enrollment)
        {
            try
            {
                var existingEnrollment = await _enrollmentService.GetEnrollmentById(enrollmentId);

                if (existingEnrollment == null)
                {
                    return NotFound("Cannot find any enrollment");
                }

                // var userId = int.Parse(User.FindFirst("UserId")!.Value);

                // if (existingEnrollment.UserId != userId)
                // {
                //     return Forbid();
                // }

                var result = await _enrollmentService
                    .UpdateEnrollment(enrollmentId, enrollment);

                if (!result)
                {
                    return NotFound("Cannot find any enrollment");
                }

                return Ok("Enrollment updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 5. Delete Enrollment
        [Authorize(Roles = "Student")]
        [HttpDelete("{enrollmentId}")]
        public async Task<ActionResult> DeleteEnrollment(int enrollmentId)
        {
            try
            {
                var existingEnrollment =
                    await _enrollmentService.GetEnrollmentById(enrollmentId);

                if (existingEnrollment == null)
                {
                    return NotFound("Cannot find any enrollment");
                }

                var userId = int.Parse(
                    User.FindFirst("UserId")!.Value);

                if (existingEnrollment.UserId != userId)
                {
                    return Forbid();
                }

                var result = await _enrollmentService
                    .DeleteEnrollment(enrollmentId);

                if (!result)
                {
                    return NotFound("Cannot find any enrollment");
                }

                return Ok("Enrollment deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 6. Get Enrollments By Course Id
        [Authorize(Roles = "Educator")]
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollmentsByCourseId(int courseId)
        {
            try
            {
                var enrollments = await _enrollmentService.GetEnrollmentsByCourseId(courseId);
                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 7. Get Enrollments By User Id
        [Authorize(Roles = "Educator")]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Enrollment>>> GetEnrollmentsByUserId(int userId)
        {
            try
            {
                var enrollments = await _enrollmentService.GetEnrollmentsByUserId(userId);
                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //Get pending request (scoped to the caller's own courses)
        [Authorize(Roles = "Educator")]
        [HttpGet("pending")]
        public async Task<ActionResult> GetPendingEnrollments()
        {
            var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
            var enrollments = await _enrollmentService.GetPendingEnrollments(callerUserId);
            return Ok(enrollments);
        }

        // Approve Enrollment Request
        [Authorize(Roles = "Educator")]
        [HttpPut("approve/{enrollmentId}")]
        public async Task<ActionResult> ApproveEnrollment(int enrollmentId)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);

                var enrollment = await _enrollmentService.GetEnrollmentById(enrollmentId);

                if (enrollment == null)
                {
                    return NotFound("Enrollment not found");
                }

                if (enrollment.Course?.EducatorId != null && enrollment.Course.EducatorId != callerUserId)
                {
                    return Forbid();
                }

                var result = await _enrollmentService.ApproveEnrollment(enrollmentId);

                if (!result)
                {
                    return NotFound("Enrollment not found");
                }

                return Ok("Enrollment approved successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Reject Enrollment Request
        [Authorize(Roles = "Educator")]
        [HttpPut("reject/{enrollmentId}")]
        public async Task<ActionResult> RejectEnrollment(int enrollmentId)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);

                var enrollment = await _enrollmentService.GetEnrollmentById(enrollmentId);

                if (enrollment == null)
                {
                    return NotFound("Enrollment not found");
                }

                if (enrollment.Course?.EducatorId != null && enrollment.Course.EducatorId != callerUserId)
                {
                    return Forbid();
                }

                var result = await _enrollmentService.RejectEnrollment(enrollmentId);

                if (!result)
                {
                    return NotFound("Enrollment not found");
                }

                return Ok("Enrollment rejected successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

