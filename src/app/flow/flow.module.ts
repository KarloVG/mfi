import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowRoutingModule } from './flow-routing.module';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [FlowOverviewComponent],
  imports: [
    CommonModule,
    FlowRoutingModule,
    SharedModule,
    ChartsModule
  ],
  exports: [FlowRoutingModule]
})
export class FlowModule {}
