import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowRoutingModule } from './flow-routing.module';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [FlowOverviewComponent],
  imports: [
    CommonModule,
    FlowRoutingModule,
    SharedModule
  ]
})
export class FlowModule { }
