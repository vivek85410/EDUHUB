using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace dotnetapp.Models
{
    public class Feedback
    {
        [Key]
        [JsonIgnore]
        public int FeedbackId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public string FeedbackText { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;
    }
}