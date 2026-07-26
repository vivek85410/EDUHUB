using System;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class ContactQuery
    {
        [Key]
        public int ContactQueryId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Subject is required")]
        public string Subject { get; set; }

        [Required(ErrorMessage = "Message is required")]
        public string Message { get; set; }

        public DateTime SubmittedDate { get; set; } = DateTime.Now;
    }
}
