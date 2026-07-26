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
    public class FeedbackService
    {
        private readonly ApplicationDbContext _context;

        public FeedbackService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get All Feedbacks
        public async Task<IEnumerable<Feedback>> GetAllFeedbacks()
        {
            var feedbacks = await _context.Feedbacks.Include(f => f.User).ToListAsync();
            ScrubPasswords(feedbacks);
            return feedbacks;
        }

        // 2. Get Feedbacks By UserId
        public async Task<IEnumerable<Feedback>> GetFeedbacksByUserId(int userId)
        {
            var feedbacks = await _context.Feedbacks.Include(f => f.User).Where(f => f.UserId == userId).ToListAsync();
            ScrubPasswords(feedbacks);
            return feedbacks;
        }

        // Never send the (plaintext-adjacent) password field back out once a nested User is serialized.
        private static void ScrubPasswords(IEnumerable<Feedback> feedbacks)
        {
            foreach (var f in feedbacks)
            {
                if (f.User != null)
                {
                    f.User.Password = string.Empty;
                }
            }
        }

        // 3. Add Feedback
        public async Task<bool> AddFeedback(Feedback feedback)
        {
            await _context.Feedbacks.AddAsync(feedback);
            await _context.SaveChangesAsync();

            return true;
        }

        // 4. Delete Feedback (only the owning student may delete their own feedback)
        public async Task<(bool Found, bool Authorized)> DeleteFeedback(int feedbackId, int callerUserId)
        {
            var feedback = await _context.Feedbacks.FirstOrDefaultAsync(f => f.FeedbackId == feedbackId);

            if (feedback == null)
            {
                return (false, false);
            }

            if (feedback.UserId != callerUserId)
            {
                return (true, false);
            }

            _context.Feedbacks.Remove(feedback);
            await _context.SaveChangesAsync();

            return (true, true);
        }
    }


}