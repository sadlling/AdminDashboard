
namespace AdminDashboard.Infrastructure.Exceptions
{
    public class CustomValidationException : Exception
    {
        public Dictionary<string, string[]> Errors { get; set; }
        public CustomValidationException(Dictionary<string, string[]> errors) : base("Multiple errors occurred. See error details.")
        {
            Errors = errors;
        }
    }

    public class InvalidPasswordException : Exception
    {
        public InvalidPasswordException(string? message) : base(message)
        {
        }
    }
    public class NotFoundException : Exception
    {
        public NotFoundException(string? message) : base(message)
        {
        }
    }
}
