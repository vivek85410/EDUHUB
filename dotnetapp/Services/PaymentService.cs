using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class PaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> RecordMockPayment(int userId, int courseId, decimal amount)
        {
            var payment = new Payment
            {
                UserId = userId,
                CourseId = courseId,
                Amount = amount,
                Status = "Success"
            };

            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();

            return payment;
        }
    }
}
