import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowRoutingModule } from './flow-routing.module';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FlowOverviewComponent],
  imports: [
    CommonModule,
    FlowRoutingModule,
    SharedModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: NgbDateAdapter,
      useClass: NgbDateNativeAdapter
    }
  ],
  exports: [FlowRoutingModule]
})
export class FlowModule {}
