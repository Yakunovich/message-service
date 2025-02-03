using Microsoft.AspNetCore.Mvc;
using MessageService.Api.Models;
using MessageService.Api.Repositories;

namespace MessageService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ILogger<MessagesController> _logger;
        private readonly IMessageRepository _repository;

        public MessagesController(ILogger<MessagesController> logger, IMessageRepository repository)
        {
            _logger = logger;
            _repository = repository;
        }

        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage(Message message)
        {
            try
            {
                _logger.LogInformation("Creating new message with OrderNum: {OrderNum}", message.OrderNum);
                message.Timestamp = DateTime.UtcNow;
                var result = await _repository.CreateMessageAsync(message);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating message");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            try
            {
                _logger.LogInformation("Retrieving messages from {From} to {To}", from, to);
                var messages = await _repository.GetMessagesByDateRangeAsync(from, to);
                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving messages");
                return StatusCode(500, "Internal server error");
            }
        }
    }
} 