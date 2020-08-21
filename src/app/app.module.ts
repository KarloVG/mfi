import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubjectService } from './shared/services/subject.service';
import { ChartsModule } from 'ng2-charts';
import { LocalStoreSubjectService } from './shared/services/local-store-subject.service';
import { LocalStoreFilterService } from './shared/services/local-store-filter.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { HttpErrorInterceptor } from './shared/interceptors/http-error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    LeafletModule,
  ],
  providers: [
    SubjectService,
    LocalStoreSubjectService,
    LocalStoreFilterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    RouterModule,
  ]
})
export class AppModule { }
