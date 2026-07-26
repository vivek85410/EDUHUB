using System.Threading.Tasks;

namespace dotnetapp.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);

        Task SendOtpEmailAsync(string toEmail, string code, string purpose);
    }
}