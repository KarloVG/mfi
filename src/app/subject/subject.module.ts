import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SharedModule } from '../shared/shared.module';
import { SubjectRoutingModule } from './subject-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    SubjectDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

  ],
  exports: [SubjectRoutingModule]
})
export class SubjectModule { }
