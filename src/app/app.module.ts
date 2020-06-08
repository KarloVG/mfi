import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDataService } from './shared/in-memory-api/fake-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStoreSubjectService } from './shared/services/local-store-subject.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    environment.production ?
    [] : HttpClientInMemoryWebApiModule.forRoot(FakeDataService, { delay: 300 })
  ],
  providers: [
    LocalStoreSubjectService
  ],
  bootstrap: [AppComponent],
  exports: [ RouterModule ]
})
export class AppModule { }