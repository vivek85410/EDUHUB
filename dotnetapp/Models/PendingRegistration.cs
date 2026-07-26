using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class PendingRegistration
    {
        public int PendingRegistrationId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        [RegularExpression(@"^[7-9]\d{9}$")]
        public string MobileNumber { get; set; }

        [Required]
        public string UserRole { get; set; }

        public string? AuthorizationKey { get; set; }

        public string OtpCode { get; set; }

        public DateTime ExpiryTime { get; set; }
    }
}
