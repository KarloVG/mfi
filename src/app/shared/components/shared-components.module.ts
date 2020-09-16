import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BasePaginationComponent } from './base-pagination/base-pagination.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalFilterComponent } from './modal-filter/modal-filter.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FilterAlertComponent } from './filter-alert/filter-alert.component';
import { VisualisationToolbarComponent } from './visualisation-toolbar/visualisation-toolbar.component';
import { ToolbarInfoComponent } from './toolbar-info/toolbar-info.component';
import { ModalCanClearViewComponent } from './modal-can-clearview/modal-can-clearview.component';

const components = [
  ConfirmationModalComponent,
  ModalOpenSubjectComponent,
  ModalFilterComponent,
  PageNotFoundComponent,
  FilterAlertComponent,
  VisualisationToolbarComponent,
  ToolbarInfoComponent,
  ModalCanClearViewComponent,
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
export class SharedComponentsModule {}
