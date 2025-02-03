using Microsoft.AspNetCore.SignalR;
using MessageService.Api.Models;

namespace MessageService.Api.Hubs
{
    public class MessageHub : Hub
    {
        public async Task SendMessage(Message message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
} 