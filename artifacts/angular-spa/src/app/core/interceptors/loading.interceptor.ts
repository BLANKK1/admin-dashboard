import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loading: LoadingService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.activeRequests++;
    if (this.activeRequests === 1) this.loading.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0) this.loading.hide();
      }),
    );
  }
}
