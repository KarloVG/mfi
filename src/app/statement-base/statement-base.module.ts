import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseOverviewComponent } from './base-overview/base-overview.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatementBaseRoutingModule } from './statement-base-routing.module';
import { ModalAddPersonComponent } from './modal-add-person/modal-add-person.component';
import { InnerBaseComponent } from './base-overview/inner-base/inner-base.component';
import { ModalBaseDetailComponent } from './base-overview/modal-base-detail/modal-base-detail.component';
import { ModalImportFileComponent } from './base-overview/modal-import-file/modal-import-file.component';
import { ModalImportTirmComponent } from './base-overview/modal-import-tirm/modal-import-tirm.component';


@NgModule({
  declarations: [BaseOverviewComponent, ModalAddPersonComponent, InnerBaseComponent, ModalBaseDetailComponent, ModalImportFileComponent, ModalImportTirmComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    StatementBaseRoutingModule
  ],
  exports: [StatementBaseRoutingModule]
})
export class StatementBaseModule { }
