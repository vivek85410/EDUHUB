using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace dotnetapp.Models
{
    public class UploadThumbnailModel
    {
        [Required]
        public IFormFile File { get; set; }
    }
}
