using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class UpdateProfileRequest
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [RegularExpression(@"^[7-9]\d{9}$", ErrorMessage = "Mobile number must be a valid 10-digit mobile number starting with 7, 8 or 9")]
        public string MobileNumber { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }
    }
}
