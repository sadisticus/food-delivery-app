﻿using FluentValidation;
using FoodDeliveryServer.Common.Dto.Request;
using FoodDeliveryServer.Common.Dto.Response;
using FoodDeliveryServer.Common.Exceptions;
using FoodDeliveryServer.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodDeliveryServer.Api.Controllers
{
    [ApiController]
    [Route("/api/partners")]
    public class PartnerController : ControllerBase
    {
        private readonly IPartnerService _partnerService;

        public PartnerController(IPartnerService partnerService)
        {
            _partnerService = partnerService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPartners([FromQuery] string? status = null)
        {
            List<PartnerResponseDto> responseDto;

            try
            {
                responseDto = await _partnerService.GetPartners(status);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ErrorResponseDto() { Message = ex.Message });
            }

            return Ok(responseDto);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPartner(long id)
        {
            PartnerResponseDto responseDto;

            try
            {
                responseDto = await _partnerService.GetPartner(id);
            }
            catch (ResourceNotFoundException ex)
            {
                return NotFound(new ErrorResponseDto() { Message = ex.Message });
            }

            return Ok(responseDto);
        }

        [HttpPost]
        public async Task<IActionResult> RegisterPartner([FromBody] RegisterUserRequestDto requestDto)
        {
            PartnerResponseDto responseDto;

            try
            {
                responseDto = await _partnerService.RegisterPartner(requestDto);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto()
                {
                    Message = "One or more validation errors occurred. See the 'Errors' for details.",
                    Errors = ex.Errors.Select(err => err.ErrorMessage).ToList()
                });
            }
            catch (UserAlreadyExistsException ex)
            {
                return Conflict(new ErrorResponseDto() { Message = ex.Message });
            }

            return Ok(responseDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Partner")]
        public async Task<IActionResult> UpdatePartner(long id, [FromBody] UpdateUserRequestDto requestDto)
        {
            Claim? idClaim = User.Claims.FirstOrDefault(x => x.Type == "UserId");
            long userId = long.Parse(idClaim!.Value);

            if (userId != id)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new ErrorResponseDto()
                {
                    Message = "Users can't update information of other users. Access is restricted."
                });
            }

            PartnerResponseDto responseDto;

            try
            {
                responseDto = await _partnerService.UpdatePartner(id, requestDto);
            }
            catch (ResourceNotFoundException ex)
            {
                return NotFound(new ErrorResponseDto() { Message = ex.Message });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto()
                {
                    Message = "One or more validation errors occurred. See the 'Errors' for details.",
                    Errors = ex.Errors.Select(err => err.ErrorMessage).ToList()
                });
            }
            catch (UserAlreadyExistsException ex)
            {
                return Conflict(new ErrorResponseDto() { Message = ex.Message });
            }

            return Ok(responseDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePartner(long id)
        {
            DeleteEntityResponseDto responseDto;

            try
            {
                responseDto = await _partnerService.DeletePartner(id);
            }
            catch (ResourceNotFoundException ex)
            {
                return NotFound(new ErrorResponseDto() { Message = ex.Message });
            }

            return Ok(responseDto);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyPartner(long id, [FromBody] VerifyPartnerRequestDto requestDto)
        {
            PartnerResponseDto responseDto;

            try
            {
                responseDto = await _partnerService.VerifyPartner(id, requestDto);
            }
            catch (ResourceNotFoundException ex)
            {
                return NotFound(new ErrorResponseDto() { Message = ex.Message });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new ErrorResponseDto()
                {
                    Message = "One or more validation errors occurred. See the 'Errors' for details.",
                    Errors = ex.Errors.Select(err => err.ErrorMessage).ToList()
                });
            }

            return Ok(responseDto);
        }
    }
}
