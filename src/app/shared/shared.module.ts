import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from './components/shared-components.module';
import { LayoutModule } from './layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'

@NgModule({
  declarations: [ModalBaseDetailComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedComponentsModule,
    ToastrModule.forRoot(),
    NgxDatatableModule,
    NgSelectModule,
    FormsModule
  ],
  entryComponents: [ModalBaseDetailComponent],
  exports: [CommonModule,NgbModule, LayoutModule, NgxDatatableModule, SharedComponentsModule, ModalBaseDetailComponent]
})
export class SharedModule {}
