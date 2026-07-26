using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;
 
        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }
 
        // 1. Get All Feedbacks
        [Authorize(Roles = "Educator")]
	    [HttpGet]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacks();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
 
        // 2. Get Feedbacks By User Id
        [Authorize(Roles = "Student")]
	    [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbacksByUserId(userId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
 
        // 3. Add Feedback
        [Authorize(Roles = "Student")]
	    [HttpPost]
        public async Task<ActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                var result = await _feedbackService.AddFeedback(feedback);
 
                if (result)
                {
                    return Ok("Feedback added successfully");
                }
 
                return StatusCode(500);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
 
        // 4. Delete Feedback
        [Authorize(Roles = "Student")]
	    [HttpDelete("{feedbackId}")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var callerUserId = int.Parse(User.FindFirst("UserId")!.Value);
                var (found, authorized) = await _feedbackService.DeleteFeedback(feedbackId, callerUserId);

                if (!found)
                {
                    return NotFound("Cannot find any feedback");
                }

                if (!authorized)
                {
                    return Forbid();
                }

                return Ok("Feedback deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}