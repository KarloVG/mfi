import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePaginationComponent } from './base-pagination/base-pagination.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

const components = [
  ConfirmationModalComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule
  ],
  exports: components
})
export class SharedComponentsModule { }
