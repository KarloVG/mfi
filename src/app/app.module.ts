import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubjectService } from './shared/services/subject.service';
import { LocalStoreFilterService } from './shared/services/local-store-filter.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from '@rinminase/ng-charts';
import { ChartModule } from '@syncfusion/ej2-angular-charts';

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
    NgxChartsModule,
    ChartsModule,
    ChartModule,
  ],
  providers: [
    SubjectService,
    LocalStoreFilterService
  ],
  bootstrap: [AppComponent],
  exports: [ RouterModule ]
})
export class AppModule { }
