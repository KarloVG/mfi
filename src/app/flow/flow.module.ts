import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowRoutingModule } from './flow-routing.module';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';


@NgModule({
  declarations: [FlowOverviewComponent],
  imports: [
    CommonModule,
    FlowRoutingModule
  ]
})
export class FlowModule { }
