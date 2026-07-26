using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [JsonIgnore]
        public string? IdentityUserId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$",ErrorMessage = "Password must contain uppercase, lowercase, number and special character")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3,ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [RegularExpression(@"^[7-9]\d{9}$",ErrorMessage = "Mobile number must be a valid 10-digit mobile number starting with 7, 8 or 9")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "User role is required")]
        [RegularExpression("^(Student|Educator)$",ErrorMessage = "Role must be either Student or Educator")]
        public string UserRole { get; set; }

        public string? ProfilePictureUrl { get; set; }

        [NotMapped]
        public string? AuthorizationKey { get; set; }

        [JsonIgnore]
        public ICollection<Feedback>? Feedbacks { get; set; }

        [JsonIgnore]
        public ICollection<Enrollment>? Enrollments { get; set; }
    }
}