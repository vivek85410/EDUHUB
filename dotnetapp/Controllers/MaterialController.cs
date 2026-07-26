using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/material")]
    public class MaterialController : ControllerBase
    {
        private readonly MaterialService _materialService;

        public MaterialController(MaterialService materialService)
        {
            _materialService = materialService;
        }

        // 1. Get All Materials
        [Authorize(Roles = "Educator,Student")]
	    [HttpGet]
        public async Task<ActionResult<IEnumerable<Material>>> GetAllMaterials()
        {
            try
            {
                var materials = await _materialService.GetAllMaterials();
                return Ok(materials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 2. Get Material By Id
        [Authorize(Roles = "Educator,Student")]
        [HttpGet("{materialId}")]
        public async Task<ActionResult<Material>> GetMaterialById(int materialId)
        {
            try
            {
                var material = await _materialService.GetMaterialById(materialId);

                if (material == null)
                {
                    return NotFound("Cannot find any material");
                }

                return Ok(material);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 3. Add Material
        [Authorize(Roles = "Educator")]
        [HttpPost]
        public async Task<ActionResult> AddMaterial([FromBody] Material material)
        {
            try
            {
                var result = await _materialService.AddMaterial(material);

                if (result)
                {
                    return Ok("Material added successfully");
                }

                return StatusCode(500, "Failed to add material");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 4. Delete Material
        [Authorize(Roles = "Educator")]
        [HttpDelete("{materialId}")]
        public async Task<ActionResult> DeleteMaterial(int materialId)
        {
            try
            {
                var result = await _materialService.DeleteMaterial(materialId);

                if (!result)
                {
                    return NotFound("Cannot find any material");
                }

                return Ok("Material deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // 5. Get Materials By Course Id
        [Authorize(Roles = "Educator,Student")]
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<Material>>> GetMaterialsByCourseId(int courseId)
        {
            try
            {
                var materials = await _materialService.GetMaterialsByCourseId(courseId);
                return Ok(materials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}