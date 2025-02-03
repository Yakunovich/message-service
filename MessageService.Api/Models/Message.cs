using System.ComponentModel.DataAnnotations;

namespace MessageService.Api.Models
{
    public class Message
    {
        public long Id { get; set; }

        [Required]
        [StringLength(128, ErrorMessage = "Text length can't be more than 128 characters.")]
        public string Text { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; }

        [Required]
        public int OrderNum { get; set; }
    }
} 