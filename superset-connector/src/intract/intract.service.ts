// src/intract/intract.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { IntractRequestDto } from './dto/intract.request.dto';
import {
  ApiResponse,
  ErrorResponse,
} from '../common/interfaces/api-response.interface';

interface SupersetResponse {
  result: Array<{
    data: Array<any>;
  }>;
}

@Injectable()
export class IntractService {
  private readonly logger = new Logger(IntractService.name);
  private readonly keys = [
    'address',
    'twitter',
    'discord',
    'telegram',
    'email',
  ] as const;

  private readonly supersetUrl: string;
  private readonly supersetAccessToken: string;

  constructor(private configService: ConfigService) {
    const supersetUrl = this.configService.get<string>('SUPERSET_URL');
    const supersetAccessToken = this.configService.get<string>(
      'SUPERSET_ACCESS_TOKEN',
    );

    if (!supersetUrl) {
      this.logger.error('SUPERSET_URL is not defined in environment variables');
      throw new Error('SUPERSET_URL is not defined in environment variables');
    }

    if (!supersetAccessToken) {
      this.logger.error(
        'SUPERSET_ACCESS_TOKEN is not defined in environment variables',
      );
      throw new Error(
        'SUPERSET_ACCESS_TOKEN is not defined in environment variables',
      );
    }

    this.supersetUrl = supersetUrl;
    this.supersetAccessToken = supersetAccessToken;

    this.logger.log(`Superset URL: ${this.supersetUrl}`);
  }

  async getIntractData(dto: IntractRequestDto): Promise<ApiResponse> {
    const { key, value } = this.getPayloadKeyAndValue(dto);
    const supersetRequestBody = this.createSupersetRequestBody(key, value);
    try {
      const response = await this.sendRequest(supersetRequestBody);
      return this.processResponse(response.data);
    } catch (error: any) {
      // The exception will be caught by the global filter
      throw error;
    }
  }

  private getPayloadKeyAndValue(dto: IntractRequestDto) {
    const key = this.keys.find((k) => dto[k]);
    if (!key)
      throw new HttpException(
        'Invalid request format: valid key not found',
        HttpStatus.BAD_REQUEST,
      );
    const value = dto[key];
    if (value === undefined)
      throw new HttpException(
        `Value for key "${key}" is undefined`,
        HttpStatus.BAD_REQUEST,
      );
    return { key, value };
  }

  private createSupersetRequestBody(
    key: typeof this.keys[number],
    value: string,
  ) {
    const supersetRequestBody = {
      datasource: { id: 175, type: 'table' },
      queries: [
        {
          filters: [{ col: 'id', op: '==', val: value }],
          columns: ['id'],
          limit: 1,
        },
      ],
    };
    return supersetRequestBody;
  }

  private async sendRequest(
    body: object,
  ): Promise<AxiosResponse<SupersetResponse>> {
    try {
      this.logger.log(
        `Sending request to Superset with body: ${JSON.stringify(body)}`,
      );
      const response: AxiosResponse<SupersetResponse> = await axios.post(
        this.supersetUrl,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.supersetAccessToken}`,
          },
        },
      );
      this.logger.log(
        `Received response from Superset: ${JSON.stringify(response.data)}`,
      );
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Superset request failed: ${error.message}`,
          error.stack,
        );
        throw new HttpException(
          `Superset request failed: ${error.message}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.logger.error(
          'An unexpected error occurred while communicating with Superset',
          error.stack,
        );
        throw new HttpException(
          'An unexpected error occurred while communicating with Superset',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private processResponse(supersetData: SupersetResponse): ApiResponse {
    const hasData =
      supersetData.result[0]?.data && supersetData.result[0].data.length > 0;
    if (!hasData) {
      const error: ErrorResponse = { code: 0, message: 'Data not found' };
      return {
        error,
        data: { result: false },
      };
    }
    const successError: ErrorResponse = { code: 0, message: '' };
    return {
      error: successError,
      data: { result: true },
    };
  }
}
