// src/auth/auth.auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly TOKEN = process.env.ACCESS_TOKEN;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = this.getRequestFromContext(context);
    this.validateAuthorizationHeader(request);
    return true;
  }

  private getRequestFromContext(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  private validateAuthorizationHeader(request: any) {
    const authHeader = this.getAuthorizationHeaderFromRequest(request);

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || token !== this.TOKEN) {
      this.throwUnauthorizedException('Invalid access token');
    }
  }

  private getAuthorizationHeaderFromRequest(request: any) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      this.throwUnauthorizedException('Authorization header is missing');
    }

    return authHeader;
  }

  private throwUnauthorizedException(message: string): void {
    throw new UnauthorizedException(message);
  }
}
