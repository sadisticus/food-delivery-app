﻿using FoodDeliveryApi.Enums;

namespace FoodDeliveryApi.Dto.Auth
{
    public class TokenResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set;} = string.Empty;
        public int ExpiresIn { get; set; }
    }
}