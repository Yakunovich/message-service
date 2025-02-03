namespace MessageService.Api.Models
{
    public class Message
    {
        public long Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public int OrderNum { get; set; }
    }
} 