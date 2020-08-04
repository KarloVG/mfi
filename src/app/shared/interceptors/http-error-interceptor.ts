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

   @Injectable()
   export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        // private toastr: ToastrService
        ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              // client-side error
              errorMessage = `Error: ${error.error.message}`;
            } else {
              // server-side error
              console.error('HEI', error)
              errorMessage = error ? error.error ? error.error.response : 'Kontaktirajte administratora' : 'Kontaktirajte administratora';
            }
            // this.toastr.error(errorMessage,'Pogreška', {
            //    progressBar: true,
            //    timeOut: 7500
            // });
            return throwError(errorMessage);
          })
        )
    }
   }
