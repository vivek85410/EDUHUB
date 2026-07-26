using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        [JsonIgnore]
        public User? User { get; set; }

        [Required]
        public int CourseId { get; set; }

        [ForeignKey("CourseId")]
        [JsonIgnore]
        public Course? Course { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string Status { get; set; } = "Success";

        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
