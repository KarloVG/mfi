import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from './components/shared-components.module';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule,
    SharedComponentsModule
  ],
  exports: [CommonModule,NgbModule, LayoutModule]
})
export class SharedModule { }
