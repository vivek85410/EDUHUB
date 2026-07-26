using System;
using System.ComponentModel.DataAnnotations;
namespace dotnetapp.Models
{
    public enum OtpPurpose { EmailVerification, PasswordReset }
    public class OtpCode
    {
        [Key]
        public int OtpCodeId { get; set; }
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Code { get; set; } = string.Empty;
        public OtpPurpose Purpose { get; set; }
        public DateTime ExpiryTime { get; set; }
        public bool IsUsed { get; set; }
    }
}