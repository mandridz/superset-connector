// src/intract/dto/intract.request.dto.ts
import {
  IsOptional,
  IsString,
  IsLowercase,
  IsEmail,
  Validate,
} from 'class-validator';
import { IsSingleField } from '../../common/validators/is-single-field.validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IntractRequestDto {
  @ApiPropertyOptional({
    description: 'Ethereum Address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsOptional()
  @IsString()
  @IsLowercase()
  address?: string;

  @ApiPropertyOptional({ description: 'Twitter ID', example: 'userTwitterID' })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({ description: 'Discord ID', example: 'userDiscordID' })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiPropertyOptional({
    description: 'Telegram ID',
    example: 'userTelegramID',
  })
  @IsOptional()
  @IsString()
  telegram?: string;

  @ApiPropertyOptional({
    description: 'Email Address',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  // Fictitious field to apply class-level validation
  @Validate(IsSingleField)
  singleFieldValidator?: any;
}
