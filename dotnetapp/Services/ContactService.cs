using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace dotnetapp.Services
{
    public class ContactService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly EmailSettings _emailSettings;

        public ContactService(ApplicationDbContext context, IEmailService emailService, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _emailService = emailService;
            _emailSettings = emailSettings.Value;
        }

        public async Task<bool> AddContactQuery(ContactQuery query)
        {
            await _context.ContactQueries.AddAsync(query);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(_emailSettings.SenderEmail))
            {
                await _emailService.SendEmailAsync(
                    _emailSettings.SenderEmail,
                    $"New Contact Query: {query.Subject}",
                    $"<p><strong>From:</strong> {query.Name} ({query.Email})</p><p><strong>Subject:</strong> {query.Subject}</p><p>{query.Message}</p>");
            }

            return true;
        }
    }
}
