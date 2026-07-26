using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/account")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }

        // Step 1 - Send OTP

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService
                .ForgotPasswordAsync(request.Email);

            if (!result.Item1)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Status = "Success",
                Message = result.Item2
            });
        }

        // Step 2 - Verify OTP

        [HttpPost("verify-reset-otp")]
        public async Task<IActionResult> VerifyResetOtp(
            [FromBody] VerifyOtpRequest request)
        {
            var result = await _authService
                .VerifyPasswordResetOtpAsync(
                    request.Email,
                    request.Otp);

            if (!result.Item1)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Status = "Success",
                Message = result.Item2
            });
        }

        // Step 3 - Reset Password

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
            [FromBody] ResetPasswordRequest request)
        {
            var result = await _authService
                .ResetPasswordAsync(
                    request.Email,
                    request.Otp,
                    request.NewPassword);

            if (!result.Item1)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = result.Item2
                });
            }

            return Ok(new
            {
                Status = "Success",
                Message = result.Item2
            });
        }
    }
}