using System.Threading.Tasks;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public interface IAuthService
    {
        // Registration
        Task<(int, string)> Registration(
            User model,
            string role);

        Task<(bool, string)> VerifyRegistrationAsync(
            string email,
            string otp);

        // Login
        Task<(int, string)> Login(
            LoginModel model);

        // Forgot Password
        Task<(bool, string)> ForgotPasswordAsync(
            string email);

        Task<(bool, string)> VerifyPasswordResetOtpAsync(
            string email,
            string otp);

        Task<(bool, string)> ResetPasswordAsync(
            string email,
            string code,
            string newPassword);
    }
}