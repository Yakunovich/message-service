 using MessageService.Api.Models;

namespace MessageService.Api.Repositories
{
    public interface IMessageRepository
    {
        Task<Message> CreateMessageAsync(Message message);
        Task<IEnumerable<Message>> GetMessagesByDateRangeAsync(DateTime from, DateTime to);
    }
}