import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, tap, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly configServce: ConfigService
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({
      apiVersion: this.configServce.get("appConfig.apiVersion"),
      data: data,
    })))
  }
}
