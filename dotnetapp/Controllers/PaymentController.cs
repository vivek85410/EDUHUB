using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        public class MockPayRequest
        {
            public int CourseId { get; set; }
            public decimal Amount { get; set; }
        }

        [Authorize(Roles = "Student")]
        [HttpPost("mock-pay")]
        public async Task<ActionResult> MockPay([FromBody] MockPayRequest request)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("UserId")!.Value);
                var payment = await _paymentService.RecordMockPayment(userId, request.CourseId, request.Amount);

                return Ok(new { status = "Success", paymentId = payment.PaymentId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
