using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace dotnetapp.Models
{
    public class UploadProfilePictureModel
    {
        [Required]
        public IFormFile File { get; set; }
    }
}
