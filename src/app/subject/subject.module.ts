import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SharedModule } from '../shared/shared.module';
import { SubjectRoutingModule } from './subject-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalSubjectPermissionComponent } from './subject-detail/modal-subject-permission/modal-subject-permission.component';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { SubjectAddOrEditComponent } from './subject-add-or-edit/subject-add-or-edit.component';
import { ModalCanDeactivateComponent } from './subject-add-or-edit/modal-can-deactivate/modal-can-deactivate.component';

@NgModule({
  declarations: [
    SubjectDetailComponent,
    ModalSubjectPermissionComponent,
    SubjectAddOrEditComponent,
    ModalCanDeactivateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  exports: [SubjectRoutingModule],
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeAdapter
    }
  ],
  entryComponents: [ModalSubjectPermissionComponent]
  
})
export class SubjectModule { }
