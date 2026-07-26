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
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetProfile(int userId)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<bool> UpdateProfile(int userId, UpdateProfileRequest updatedUser)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return false;

            user.Username = updatedUser.Username;
            user.MobileNumber = updatedUser.MobileNumber;
            user.Email = updatedUser.Email;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateProfilePicture(int userId, string url)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return false;

            user.ProfilePictureUrl = url;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteProfile(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return false;

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}