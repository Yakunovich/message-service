using MessageService.Api.Models;
using Npgsql;
using System.Data;

namespace MessageService.Api.Repositories
{
    public class PostgresMessageRepository : IMessageRepository
    {
        private readonly string _connectionString;
        private readonly ILogger<PostgresMessageRepository> _logger;

        public PostgresMessageRepository(IConfiguration configuration, ILogger<PostgresMessageRepository> logger)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("DefaultConnection string is not configured");
            _logger = logger;
        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            const string sql = @"
                INSERT INTO messages (text, timestamp, order_num) 
                VALUES (@text, @timestamp, @orderNum) 
                RETURNING id, text, timestamp, order_num";

            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@text", message.Text);
            command.Parameters.AddWithValue("@timestamp", message.Timestamp);
            command.Parameters.AddWithValue("@orderNum", message.OrderNum);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Message
                {
                    Id = reader.GetInt64(0),
                    Text = reader.GetString(1),
                    Timestamp = reader.GetDateTime(2),
                    OrderNum = reader.GetInt32(3)
                };
            }

            throw new Exception("Failed to create message");
        }

        public async Task<IEnumerable<Message>> GetMessagesByDateRangeAsync(DateTime from, DateTime to)
        {
            const string sql = @"
                SELECT id, text, timestamp, order_num 
                FROM messages 
                WHERE timestamp BETWEEN @from AND @to 
                ORDER BY timestamp";

            using var connection = new NpgsqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("@from", from);
            command.Parameters.AddWithValue("@to", to);

            var messages = new List<Message>();
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                messages.Add(new Message
                {
                    Id = reader.GetInt64(0),
                    Text = reader.GetString(1),
                    Timestamp = reader.GetDateTime(2),
                    OrderNum = reader.GetInt32(3)
                });
            }

            return messages;
        }
    }
} 