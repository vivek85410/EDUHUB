using System;
using System.Threading.Tasks;
using dotnetapp.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace dotnetapp.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IOptions<EmailSettings> settings,
            ILogger<EmailService> logger)
        {
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string htmlBody)
        {
            var message = new MimeMessage();

            message.From.Add(
                new MailboxAddress(
                    _settings.SenderName,
                    _settings.SenderEmail));

            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = htmlBody
            };

            using var client = new SmtpClient();

            try
            {
                await client.ConnectAsync(
                    _settings.Host,
                    _settings.Port,
                    SecureSocketOptions.StartTls);

                await client.AuthenticateAsync(
                    _settings.SenderEmail,
                    _settings.Password);

                await client.SendAsync(message);

                await client.DisconnectAsync(true);

                _logger.LogInformation(
                    "Email sent to {Email}",
                    toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send email to {Email}",
                    toEmail);
            }
        }

        public Task SendOtpEmailAsync(
            string toEmail,
            string code,
            string purpose)
        {
            var subject = $"Your LMS OTP code is {code}";

            var body = $@"<div style='font-family:Arial,sans-serif;padding:20px;color:#333'>
                <h2>LMS Portal</h2>
                <p>Use the code below to {purpose}.</p>
                <h1 style='letter-spacing:8px;color:#2563eb'>{code}</h1>
                <p>This code expires in 10 minutes.</p>
                <p style='font-size:12px;color:#888'>
                    If you did not request this, please ignore this email.
                </p>
                </div>";

            return SendEmailAsync(toEmail, subject, body);
        }
    }
}