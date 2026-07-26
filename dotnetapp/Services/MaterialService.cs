using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Exceptions;
using dotnetapp.Models;

 
namespace dotnetapp.Services
{
    public class MaterialService
    {
        private readonly ApplicationDbContext _context;

        public MaterialService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Material>> GetAllMaterials()
        {
            return await _context.Materials
                .Include(m => m.Course)
                .ToListAsync();
        }

        public async Task<Material> GetMaterialById(int materialId)
        {
            return await _context.Materials
                .FirstOrDefaultAsync(m => m.MaterialId == materialId);
        }

        public async Task<bool> AddMaterial(Material material)
        {
            _context.Materials.Add(material);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMaterial(int materialId)
        {
            var material = await _context.Materials
                .FirstOrDefaultAsync(m => m.MaterialId == materialId);

            if (material == null)
                return false;

            _context.Materials.Remove(material);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Material>> GetMaterialsByCourseId(int courseId)
        {
            return await _context.Materials
                .Where(m => m.CourseId == courseId)
                .ToListAsync();
        }
    }
}