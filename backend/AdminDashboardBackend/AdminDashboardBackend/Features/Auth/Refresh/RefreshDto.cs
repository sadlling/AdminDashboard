using AdminDashboard.API.Features.Auth.Login;

namespace AdminDashboard.API.Features.Auth.Refresh;

public record RefreshTokenApiRequest(); 
public record RefreshTokenApiResponse(string Message, UserInfoDto User);
