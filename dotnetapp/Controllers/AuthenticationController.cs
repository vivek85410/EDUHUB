using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("/api/login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _authService.Login(model);

            if (result.Item1 == 0)
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
                token = result.Item2
            });
        }

        [AllowAnonymous]
        [HttpPost("/api/register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Status = "Error",
                        Message = "Invalid payload"
                    });
                }

                var result = await _authService.Registration(model, model.UserRole);

                if (result.Item1 == 0)
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
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Status = "Error",
                    Message = ex.Message
                });
            }
        }

        [AllowAnonymous]
        [HttpPost("/api/verify-registration")]
        public async Task<IActionResult> VerifyRegistration(
            [FromBody] VerifyRegistrationRequest request)
        {
            var result = await _authService.VerifyRegistrationAsync(request.Email,request.Otp);

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