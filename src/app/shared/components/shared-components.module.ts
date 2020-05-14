import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasePaginationComponent } from './base-pagination/base-pagination.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedComponentsModule { }
