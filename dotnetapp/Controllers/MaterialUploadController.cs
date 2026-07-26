using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using dotnetapp.Models;
using dotnetapp.Services;
namespace dotnetapp.Controllers
{
    [Route("api/materialupload")]
    [ApiController]
    public class MaterialUploadController : ControllerBase
    {
        private readonly FileUploadService _fileUploadService;
        private readonly MaterialService _materialService;
        public MaterialUploadController(FileUploadService fileUploadService, MaterialService materialService)
        {
            _fileUploadService = fileUploadService;
            _materialService = materialService;
        }
        [Authorize(Roles = "Educator")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadMaterial([FromForm] UploadMaterialModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest("Invalid form data.");
                }
                if (model.File == null || model.File.Length == 0)
                {
                    return BadRequest("Please select a valid file.");
                }
                var uploadResult = await _fileUploadService.UploadFile(model.File);
                if (!uploadResult.Success)
                {
                    return BadRequest("Invalid file type. Allowed types are pdf, ppt, pptx, doc, docx, jpg, jpeg, png, gif, mp4, avi, mov, mkv.");
                }
                Material material = new Material
                {
                    CourseId = model.CourseId,
                    Title = model.Title,
                    Description = model.Description,
                    URL = uploadResult.Url,
                    ContentType = uploadResult.ContentType,
                    UploadDate = DateTime.Now
                };
                await _materialService.AddMaterial(material);
                return Ok(new
                {
                    Message = "File uploaded successfully",
                    MaterialUrl = material.URL,
                    ContentType = material.ContentType,
                    FileName = model.File.FileName,
                    CourseId = material.CourseId,
                    Title = material.Title
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error while uploading material",
                    Error = ex.Message,
                    InnerError = ex.InnerException != null ? ex.InnerException.Message : null
                });
            }
        }
    }
}