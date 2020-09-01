import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1), //retry request once more!!!
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // server-side error
            errorMessage = error ? error.error : 'Kontaktirajte administratora';
          }
          this.toastr.error(errorMessage ? errorMessage : 'Kontaktirajte administratora', 'Pogreška', {
            closeButton: true,
            extendedTimeOut: 0,
            timeOut: 0,
            tapToDismiss: false
          });
          return throwError(errorMessage);
        })
      )
  }
}
