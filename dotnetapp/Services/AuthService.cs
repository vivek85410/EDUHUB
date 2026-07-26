using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private const int OtpExpiryMinutes = 10;

        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<AuthService> logger)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }


        public async Task<(int, string)> Registration(User model, string role)
        {
            if (!string.Equals(role, UserRoles.Educator, StringComparison.OrdinalIgnoreCase) && !string.Equals(role, UserRoles.Student, StringComparison.OrdinalIgnoreCase))
            {
                return (0, "Invalid role. Only Educator and Student are allowed.");
            }
            if (string.IsNullOrWhiteSpace(model.Username))
            {
                return (0, "Username is required.");
            }

            if (model.Username.Length < 3)
            {
                return (0, "Username must be at least 3 characters.");
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(model.MobileNumber,@"^[7-9]\d{9}$"))
            {
                return (0,"Please enter a valid 10-digit mobile number starting with 7, 8 or 9.");
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(model.Password,@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"))
            {
                return (0,"Password must contain uppercase, lowercase, number and special character.");
            }

            if (string.Equals(role, UserRoles.Educator, StringComparison.OrdinalIgnoreCase))
            {
                var expectedKey = _configuration["EducatorRegistrationSecretKey"];
                if (string.IsNullOrEmpty(expectedKey) || !string.Equals(model.AuthorizationKey, expectedKey, StringComparison.Ordinal))
                {
                    return (0, "Invalid or missing educator authorization key.");
                }
            }

            var existingIdentityUser = await userManager.FindByEmailAsync(model.Email);

            if (existingIdentityUser != null)
            {
                return (0, "User already exists.");
            }

            var pendingUser = await _context.PendingRegistrations.FirstOrDefaultAsync(x => x.Email == model.Email);

            if (pendingUser != null)
            {
                _context.PendingRegistrations.Remove(pendingUser);
                await _context.SaveChangesAsync();
            }

            string otp = Random.Shared.Next(100000, 999999).ToString();

            pendingUser = new PendingRegistration
            {
                Email = model.Email,
                Username = model.Username,
                Password = model.Password,
                MobileNumber = model.MobileNumber,
                UserRole = role,
                OtpCode = otp,
                ExpiryTime = DateTime.UtcNow.AddMinutes(10)
            };

            await _context.PendingRegistrations.AddAsync(pendingUser);

            await _context.SaveChangesAsync();

            await _emailService.SendOtpEmailAsync(model.Email, otp, "complete your registration");

            return (1, "OTP sent successfully. Verify OTP to complete registration.");
        }

        // public async Task<(int, string)> Registration(User model, string role)
        // {
        //     if (!string.Equals(role, UserRoles.Educator, StringComparison.OrdinalIgnoreCase) &&
        //         !string.Equals(role, UserRoles.Student, StringComparison.OrdinalIgnoreCase))
        //     {
        //         return (0, "Invalid role.");
        //     }

        //     var userExists = await userManager.FindByEmailAsync(model.Email);

        //     if (userExists != null)
        //     {
        //         return (0, "User already exists");
        //     }

        //     if (!await roleManager.RoleExistsAsync(role))
        //     {
        //         await roleManager.CreateAsync(new IdentityRole(role));
        //     }

        //     ApplicationUser identityUser = new ApplicationUser()
        //     {
        //         Email = model.Email,
        //         UserName = model.Email,
        //         Name = model.Username,
        //         SecurityStamp = Guid.NewGuid().ToString(),
        //         IsEmailVerified = true
        //     };

        //     var result = await userManager.CreateAsync(
        //         identityUser,
        //         model.Password);

        //     if (!result.Succeeded)
        //     {
        //         return (0, "User creation failed");
        //     }

        //     await userManager.AddToRoleAsync(
        //         identityUser,
        //         role);

        //     User customUser = new User
        //     {
        //         IdentityUserId = identityUser.Id,
        //         Email = model.Email,
        //         Username = model.Username,
        //         MobileNumber = model.MobileNumber,
        //         UserRole = role,
        //         Password = model.Password
        //     };

        //     await _context.Users.AddAsync(customUser);

        //     await _context.SaveChangesAsync();

        //     return (1, "User created successfully");
        // }

        // Login 
        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return (0, "Invalid email");
            }

            var customUser = await _context.Users
                .FirstOrDefaultAsync(x => x.IdentityUserId == user.Id);

            if (customUser == null)
            {
                return (0, "User profile not found");
            }

            bool isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);

            if (!isPasswordValid)
            {
                return (0, "Invalid password");
            }

            var userRoles = await userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("IdentityUserId", user.Id),
                new Claim("UserId", customUser.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GenerateToken(authClaims);

            return (1, token);
        }


        // Forgot password - send OTP
        public async Task<(bool, string)> ForgotPasswordAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return (false, "No account found with that email.");
            }

            var code = await CreateOtpAsync(email, OtpPurpose.PasswordReset);

            await _emailService.SendOtpEmailAsync(
                email,
                code,
                "reset your password");

            return (true, "Password reset OTP sent to your email.");
        }

        //verify Registration
        public async Task<(bool, string)> VerifyRegistrationAsync(string email, string otp)
        {
            var pendingUser = await _context.PendingRegistrations.FirstOrDefaultAsync(x => x.Email == email && x.OtpCode == otp && x.ExpiryTime > DateTime.UtcNow);

            if (pendingUser == null)
            {
                return (false, "Invalid or expired OTP.");
            }

            if (!await roleManager.RoleExistsAsync(pendingUser.UserRole))
            {
                await roleManager.CreateAsync(new IdentityRole(pendingUser.UserRole));
            }

            ApplicationUser identityUser = new ApplicationUser()
            {
                Email = pendingUser.Email,
                UserName = pendingUser.Email,
                Name = pendingUser.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                IsEmailVerified = true
            };

            var result = await userManager.CreateAsync(identityUser, pendingUser.Password);

            if (!result.Succeeded)
            {
                return (false, "User creation failed.");
            }

            await userManager.AddToRoleAsync(identityUser, pendingUser.UserRole);

            User user = new User
            {
                IdentityUserId = identityUser.Id,
                Email = pendingUser.Email,
                Username = pendingUser.Username,
                MobileNumber = pendingUser.MobileNumber,
                UserRole = pendingUser.UserRole,
                Password = pendingUser.Password
            };

            await _context.Users.AddAsync(user);

            _context.PendingRegistrations.Remove(pendingUser);

            await _context.SaveChangesAsync();

            return (true, "Registration completed successfully.");
        }


        // Reset password using OTP
        public async Task<(bool, string)> ResetPasswordAsync(
            string email,
            string code,
            string newPassword)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return (false, "No account found with that email.");
            }

            var otp = await FindValidOtpAsync(email, code, OtpPurpose.PasswordReset);

            if (otp == null)
            {
                return (false, "Invalid or expired OTP.");
            }

            var removePasswordResult = await userManager.RemovePasswordAsync(user);

            if (!removePasswordResult.Succeeded)
            {
                return (false, string.Join(", ",
                    removePasswordResult.Errors.Select(e => e.Description)));
            }

            var addPasswordResult = await userManager.AddPasswordAsync(user, newPassword);

            if (!addPasswordResult.Succeeded)
            {
                return (false, string.Join(", ",
                    addPasswordResult.Errors.Select(e => e.Description)));
            }
            var customUser = await _context.Users
                .FirstOrDefaultAsync(x => x.IdentityUserId == user.Id);

            if (customUser != null)
            {
                var passwordHasher = new PasswordHasher<User>();
                customUser.Password = passwordHasher.HashPassword(customUser, newPassword); ;
            }

            otp.IsUsed = true;

            await _context.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                email,
                "Password changed",
                "<p>Your LMS password was changed successfully.</p>");

            return (true, "Password reset successfully.");
        }

        public async Task<(bool, string)> VerifyPasswordResetOtpAsync(string email, string otp)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return (false, "No account found with that email.");
            }

            var validOtp = await FindValidOtpAsync(
                email,
                otp,
                OtpPurpose.PasswordReset);

            if (validOtp == null)
            {
                return (false,
                    "Invalid or expired OTP.");
            }

            return (true,
                "OTP verified successfully.");
        }

        private async Task<string> CreateOtpAsync(string email, OtpPurpose purpose)
        {
            var oldOtps = await _context.OtpCodes
                .Where(x =>
                    x.Email == email &&
                    x.Purpose == purpose &&
                    !x.IsUsed)
                .ToListAsync();

            foreach (var oldOtp in oldOtps)
            {
                oldOtp.IsUsed = true;
            }

            var code = Random.Shared.Next(100000, 1000000).ToString();

            _context.OtpCodes.Add(new OtpCode
            {
                Email = email,
                Code = code,
                Purpose = purpose,
                ExpiryTime = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes),
                IsUsed = false
            });

            await _context.SaveChangesAsync();

            // Helpful during testing. Remove before production.
            _logger.LogInformation("OTP for {Email} is {Code}", email, code);

            return code;
        }

        private async Task<OtpCode?> FindValidOtpAsync(
            string email,
            string code,
            OtpPurpose purpose)
        {
            return await _context.OtpCodes
                .FirstOrDefaultAsync(o =>
                    o.Email == email &&
                    o.Code == code &&
                    o.Purpose == purpose &&
                    !o.IsUsed &&
                    o.ExpiryTime > DateTime.UtcNow);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var rsa = RSA.Create();

            string privateKey =
                File.ReadAllText("Keys/private.pem");

            rsa.ImportFromPem(privateKey);

            var credentials =
                new SigningCredentials(
                    new RsaSecurityKey(rsa),
                    SecurityAlgorithms.RsaSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: claims,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}