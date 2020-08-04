import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule }    from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubjectService } from './shared/services/subject.service';
import { ChartsModule } from 'ng2-charts';
import { LocalStoreSubjectService } from './shared/services/local-store-subject.service';

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
    ChartsModule
  ],
  providers: [
    SubjectService,
    LocalStoreSubjectService
  ],
  bootstrap: [AppComponent],
  exports: [
    RouterModule,
  ]
})
export class AppModule { }
