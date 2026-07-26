using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
namespace dotnetapp.Services
{
    public class FileUploadService
    {
        private readonly IWebHostEnvironment _environment;
        public FileUploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public async Task<(bool Success, string Url, string ContentType)> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return (false, "", "");
            }
            string extension = Path.GetExtension(file.FileName).ToLower();
            string folderName = GetFolderName(extension);
            if (folderName == "invalid")
            {
                return (false, "", "");
            }
            string rootPath = _environment.WebRootPath;
            if (string.IsNullOrEmpty(rootPath))
            {
                rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }
            string folderPath = Path.Combine(rootPath, "materials", folderName);
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            string uniqueFileName = Guid.NewGuid().ToString() + extension;
            string filePath = Path.Combine(folderPath, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            string fileUrl = $"/materials/{folderName}/{uniqueFileName}";
            return (true, fileUrl, file.ContentType);
        }
        // Dedicated image upload (course thumbnails, profile pictures) with an explicit size limit.
        public async Task<(bool Success, string Url, string ContentType, string? Error)> UploadImage(IFormFile file, long maxBytes)
        {
            if (file == null || file.Length == 0)
            {
                return (false, "", "", "Please select a valid image file.");
            }

            if (file.Length > maxBytes)
            {
                return (false, "", "", $"Image is too large. Maximum allowed size is {maxBytes / (1024 * 1024)}MB.");
            }

            string extension = Path.GetExtension(file.FileName).ToLower();
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

            if (!imageExtensions.Contains(extension))
            {
                return (false, "", "", "Invalid image type. Allowed types are jpg, jpeg, png, gif, webp.");
            }

            var uploadResult = await UploadFile(file);

            if (!uploadResult.Success)
            {
                return (false, "", "", "Failed to upload image.");
            }

            return (true, uploadResult.Url, uploadResult.ContentType, null);
        }

        private string GetFolderName(string extension)
        {
            string[] imageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            string[] videoExtensions = { ".mp4", ".avi", ".mov", ".mkv", ".wmv" };
            string[] pdfExtensions = { ".pdf" };
            string[] presentationExtensions = { ".ppt", ".pptx" };
            string[] documentExtensions = { ".doc", ".docx", ".txt" };
            if (imageExtensions.Contains(extension))
            {
                return "images";
            }
            if (videoExtensions.Contains(extension))
            {
                return "videos";
            }
            if (pdfExtensions.Contains(extension))
            {
                return "pdfs";
            }
            if (presentationExtensions.Contains(extension))
            {
                return "presentations";
            }
            if (documentExtensions.Contains(extension))
            {
                return "documents";
            }
            return "invalid";
        }
    }
}