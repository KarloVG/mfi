import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BasePaginationComponent } from './base-pagination/base-pagination.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ConfirmExitModalComponent } from './confirm-exit-modal/confirm-exit-modal.component';

const components = [
  ConfirmationModalComponent,
  ConfirmExitModalComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule
  ],
  exports: components
})
export class SharedComponentsModule { }
