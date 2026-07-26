using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnetapp.Models
{
    public class Course
    {
        [Key]
        public int CourseId { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 3)]
        public string Title { get; set; }

        [Required]
        [StringLength(2000, MinimumLength = 10)]
        public string Description { get; set; }

        public DateTime CourseStartDate { get; set; }

        public DateTime CourseEndDate { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public string Level { get; set; }

        public int? EducatorId { get; set; }

        public string? ThumbnailUrl { get; set; }

        public decimal? Price { get; set; }

        //Take a look for (JsonIgnore) here too or else
        // add Json Ignore code in program.cs file.
        [JsonIgnore]
        public ICollection<Enrollment>? Enrollments { get; set; }
        [JsonIgnore]

        public ICollection<Material>? Materials { get; set; }
    }
}