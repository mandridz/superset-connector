// src/intract/intract.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { IntractService } from './intract.service';
import { IntractRequestDto } from './dto/intract.request.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiResponse as SwaggerApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { ApiResponse } from '../common/interfaces/api-response.interface';

@ApiTags('intract')
@ApiBearerAuth()
@Controller('api/v1/intract')
export class IntractController {
  constructor(private readonly intractService: IntractService) {}

  @Post('data')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get chart data' })
  @ApiBody({ type: IntractRequestDto })
  @SwaggerApiResponse({
    status: 200,
    description: 'Successful response',
    type: Object,
  })
  async getIntractData(
    @Body() intractRequestDto: IntractRequestDto,
  ): Promise<ApiResponse> {
    return this.intractService.getIntractData(intractRequestDto);
  }
}
