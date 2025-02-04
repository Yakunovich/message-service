using Microsoft.AspNetCore.Mvc;
using MessageService.Api.Models;
using MessageService.Api.Repositories;
using MessageService.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace MessageService.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ILogger<MessagesController> _logger;
        private readonly IMessageRepository _repository;
        private readonly IHubContext<MessageHub> _hubContext;

        public MessagesController(
            ILogger<MessagesController> logger, 
            IMessageRepository repository,
            IHubContext<MessageHub> hubContext)
        {
            _logger = logger;
            _repository = repository;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage(Message message)
        {
            try
            {
                _logger.LogInformation(
                    "Creating message. OrderNum: {OrderNum}, Text: {Text}", 
                    message.OrderNum, 
                    message.Text
                );
                
                message.Timestamp = DateTime.UtcNow;
                var result = await _repository.CreateMessageAsync(message);
                
                _logger.LogInformation(
                    "Message created successfully. Id: {Id}, OrderNum: {OrderNum}", 
                    result.Id, 
                    result.OrderNum
                );
                
                await _hubContext.Clients.All.SendAsync("ReceiveMessage", result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error creating message. OrderNum: {OrderNum}, Text: {Text}",
                    message.OrderNum,
                    message.Text
                );
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