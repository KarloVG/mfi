import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BasePaginationComponent } from './base-pagination/base-pagination.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ConfirmExitModalComponent } from './confirm-exit-modal/confirm-exit-modal.component';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const components = [
  ConfirmationModalComponent,
  ConfirmExitModalComponent,
  ModalOpenSubjectComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  exports: components,
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeAdapter
    }
  ]
})
export class SharedComponentsModule { }
