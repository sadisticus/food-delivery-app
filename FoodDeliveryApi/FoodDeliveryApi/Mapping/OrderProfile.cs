﻿using AutoMapper;
using FoodDeliveryApi.Dto.Order;
using FoodDeliveryApi.Models;

namespace FoodDeliveryApi.Mapping
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderItemRequestDto, OrderItem>();
            CreateMap<OrderItem, OrderItemResponseDto>();

            CreateMap<OrderItemRequestDto, OrderItem>();
            CreateMap<Order, OrderItemResponseDto>();

            CreateMap<CreateOrderRequestDto, Order>();
            CreateMap<Order, CreateOrderResponseDto>();

            CreateMap<Order, GetOrderResponseDto>()
                .ForMember(dest => dest.Store, opt => opt.MapFrom(src => src.Store));

            CreateMap<OrderItem, GetOrderItemResponseDto>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));
        }
    }
}
