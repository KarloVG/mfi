import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDataService } from './shared/in-memory-api/fake-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStoreSubjectService } from './shared/services/local-store-subject.service';
import { LocalStoreFilterService } from './shared/services/local-store-filter.service';

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
    HttpClientInMemoryWebApiModule.forRoot(FakeDataService, { delay: 300 })
  ],
  providers: [
    LocalStoreSubjectService,
    LocalStoreFilterService
  ],
  bootstrap: [AppComponent],
  exports: [ RouterModule ]
})
export class AppModule { }
