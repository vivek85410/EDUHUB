using System.Security.Claims;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly FileUploadService _fileUploadService;

        public UserController(UserService userService, FileUploadService fileUploadService)
        {
            _userService = userService;
            _fileUploadService = fileUploadService;
        }

        [HttpPost("profile-picture")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UploadProfilePicture([FromForm] UploadProfilePictureModel model)
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

            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            await _userService.UpdateProfilePicture(userId, result.Url);

            return Ok(new { url = result.Url });
        }

        [HttpGet("profile")]
        public async Task<ActionResult<User>> GetProfile()
        {
            var userId = int.Parse(
                User.FindFirst("UserId")!.Value);

            var user = await _userService.GetProfile(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile(
            [FromBody] UpdateProfileRequest user)
        {
            var userId = int.Parse(
                User.FindFirst("UserId")!.Value);

            var result =
                await _userService.UpdateProfile(
                    userId,
                    user);

            if (!result)
                return NotFound("User not found");

            return Ok("Profile updated successfully");
        }

        [HttpDelete("profile")]
        public async Task<ActionResult> DeleteProfile()
        {
            var userId = int.Parse(
                User.FindFirst("UserId")!.Value);

            var result =
                await _userService.DeleteProfile(userId);

            if (!result)
                return NotFound("User not found");

            return Ok("Account deleted successfully");
        }
    }
}