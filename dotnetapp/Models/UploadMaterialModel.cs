using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace dotnetapp.Models
{    
    public class UploadMaterialModel
    {        
        [Required]
        public int CourseId { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Required]
        public IFormFile File { get; set; }
    }
}